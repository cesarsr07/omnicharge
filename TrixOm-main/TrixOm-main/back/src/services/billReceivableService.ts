import { BillReceivable } from '../models/BillReceivable';
import { FinancialExtract } from '../models/FinancialExtract';
import { IBillReceivable, ICreateBillReceivableDTO, IUpdateBillReceivableDTO } from '../types/billReceivable.types';

export class BillReceivableService {
  async criar(dados: ICreateBillReceivableDTO): Promise<IBillReceivable> {
    const conta = new BillReceivable(dados);
    return conta.save();
  }

  async listar(filtro: { usuario_id?: string; status?: string } = {}): Promise<IBillReceivable[]> {
    const query: Record<string, unknown> = {};

    if (filtro.usuario_id) query.usuario_id = filtro.usuario_id;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (filtro.status) {
      if (filtro.status === 'atrasado') {
        query.status = { $ne: 'recebido' };
        query.data_vencimento = { $lt: hoje };
      } else if (filtro.status === 'pendente') {
        query.status = 'pendente';
        query.data_vencimento = { $gte: hoje };
      } else {
        query.status = filtro.status;
      }
    }

    const contas = await BillReceivable.find(query).sort({ data_vencimento: 1 });

    return contas.map((c) => {
      const contaObj = c.toObject();
      if (contaObj.status !== 'recebido' && new Date(contaObj.data_vencimento) < hoje) {
        contaObj.status = 'atrasado';
      }
      return contaObj as IBillReceivable;
    });
  }

  async buscarPorId(id: string): Promise<IBillReceivable | null> {
    return BillReceivable.findById(id);
  }

  async editar(id: string, usuario_id: string, dados: IUpdateBillReceivableDTO): Promise<IBillReceivable | null> {
    return BillReceivable.findOneAndUpdate(
      { _id: id, usuario_id },
      { $set: dados },
      { new: true, runValidators: true }
    );
  }

  async excluir(id: string, usuario_id: string): Promise<{ id: string } | null> {
    const deletado = await BillReceivable.findOneAndDelete({ _id: id, usuario_id });
    if (!deletado) return null;
    return { id };
  }

  async marcarComoRecebido(id: string, usuario_id: string): Promise<IBillReceivable | null> {
    const conta = await BillReceivable.findOne({ _id: id, usuario_id });
    if (!conta) return null;

    conta.status = 'recebido';
    conta.recebido_em = new Date();
    await conta.save();

    // Registrar no Extrato Financeiro como Entrada
    const extrato = new FinancialExtract({
      usuario_id: conta.usuario_id,
      tipo: 'Entrada',
      categoria: 'Contas a Receber',
      titulo: conta.apelido || conta.nome_devedor,
      descricao: conta.descricao || `Recebimento de conta: ${conta.nome_devedor}`,
      valor: conta.valor,
      data_vencimento: conta.data_vencimento,
      data_pagamento: conta.recebido_em,
      status: 'Pago',
      origem_tipo: 'conta_receber',
      origem_id: conta._id.toString(),
      nome_contato: conta.nome_devedor,
    });
    await extrato.save();

    return conta;
  }
}

export const billReceivableService = new BillReceivableService();
