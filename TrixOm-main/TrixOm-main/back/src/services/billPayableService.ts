import { BillPayable } from '../models/BillPayable';
import { FinancialExtract } from '../models/FinancialExtract';
import { IBillPayable, ICreateBillPayableDTO, IUpdateBillPayableDTO } from '../types/billPayable.types';

export class BillPayableService {
  async criar(dados: ICreateBillPayableDTO): Promise<IBillPayable> {
    const conta = new BillPayable(dados);
    return conta.save();
  }

  async listar(filtro: { usuario_id?: string; status?: string } = {}): Promise<IBillPayable[]> {
    const query: Record<string, unknown> = {};

    if (filtro.usuario_id) query.usuario_id = filtro.usuario_id;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (filtro.status) {
      if (filtro.status === 'atrasado') {
        query.status = { $ne: 'pago' };
        query.data_vencimento = { $lt: hoje };
      } else if (filtro.status === 'pendente') {
        query.status = 'pendente';
        query.data_vencimento = { $gte: hoje };
      } else {
        query.status = filtro.status;
      }
    }

    const contas = await BillPayable.find(query).sort({ data_vencimento: 1 });

    // Atualizar status dinâmico para contas atrasadas
    return contas.map((c) => {
      const contaObj = c.toObject();
      if (contaObj.status !== 'pago' && new Date(contaObj.data_vencimento) < hoje) {
        contaObj.status = 'atrasado';
      }
      return contaObj as IBillPayable;
    });
  }

  async buscarPorId(id: string): Promise<IBillPayable | null> {
    return BillPayable.findById(id);
  }

  async editar(id: string, usuario_id: string, dados: IUpdateBillPayableDTO): Promise<IBillPayable | null> {
    return BillPayable.findOneAndUpdate(
      { _id: id, usuario_id },
      { $set: dados },
      { new: true, runValidators: true }
    );
  }

  async excluir(id: string, usuario_id: string): Promise<{ id: string } | null> {
    const deletado = await BillPayable.findOneAndDelete({ _id: id, usuario_id });
    if (!deletado) return null;
    return { id };
  }

  async marcarComoPago(id: string, usuario_id: string): Promise<IBillPayable | null> {
    const conta = await BillPayable.findOne({ _id: id, usuario_id });
    if (!conta) return null;

    conta.status = 'pago';
    conta.pago_em = new Date();
    await conta.save();

    // Registrar no Extrato Financeiro como Saída
    const extrato = new FinancialExtract({
      usuario_id: conta.usuario_id,
      tipo: 'Saida',
      categoria: 'Contas a Pagar',
      titulo: conta.apelido || conta.nome_devedor,
      descricao: conta.descricao || `Pagamento de conta a pagar: ${conta.nome_devedor}`,
      valor: conta.valor,
      data_vencimento: conta.data_vencimento,
      data_pagamento: conta.pago_em,
      status: 'Pago',
      origem_tipo: 'conta_pagar',
      origem_id: conta._id.toString(),
      nome_contato: conta.nome_devedor,
    });
    await extrato.save();

    return conta;
  }
}

export const billPayableService = new BillPayableService();
