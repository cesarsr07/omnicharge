import { FinancialExtract } from '../models/FinancialExtract';
import { ICreateFinancialExtractDTO, IFinancialExtract } from '../types/financialExtract.types';

export class FinancialExtractService {
  async registrar(lancamento: ICreateFinancialExtractDTO): Promise<IFinancialExtract> {
    const extrato = new FinancialExtract(lancamento);
    return extrato.save();
  }

  async listar(
    usuario_id: string,
    filtros: { tipo?: 'Entrada' | 'Saida'; status?: string; mes?: number; ano?: number } = {}
  ): Promise<IFinancialExtract[]> {
    const query: Record<string, unknown> = { usuario_id };

    if (filtros.tipo) query.tipo = filtros.tipo;
    if (filtros.status) query.status = filtros.status;

    if (filtros.mes && filtros.ano) {
      const startDate = new Date(filtros.ano, filtros.mes - 1, 1);
      const endDate = new Date(filtros.ano, filtros.mes, 0, 23, 59, 59, 999);
      query.data_pagamento = { $gte: startDate, $lte: endDate };
    }

    return FinancialExtract.find(query).sort({ data_pagamento: -1, criado_em: -1 });
  }

  async obterBalanco(usuario_id: string, mes?: number, ano?: number) {
    const hoje = new Date();
    const mesRef = mes || hoje.getMonth() + 1;
    const anoRef = ano || hoje.getFullYear();

    const startDate = new Date(anoRef, mesRef - 1, 1);
    const endDate = new Date(anoRef, mesRef, 0, 23, 59, 59, 999);

    const lancamentos = await FinancialExtract.find({
      usuario_id,
      data_pagamento: { $gte: startDate, $lte: endDate },
    });

    const total_entradas = lancamentos
      .filter((e) => e.tipo === 'Entrada')
      .reduce((sum, e) => sum + e.valor, 0);

    const total_saidas = lancamentos
      .filter((e) => e.tipo === 'Saida')
      .reduce((sum, e) => sum + e.valor, 0);

    return {
      mes: mesRef,
      ano: anoRef,
      total_entradas,
      total_saidas,
      saldo_liquido: total_entradas - total_saidas,
      qtd_entradas: lancamentos.filter((e) => e.tipo === 'Entrada').length,
      qtd_saidas: lancamentos.filter((e) => e.tipo === 'Saida').length,
    };
  }
}

export const financialExtractService = new FinancialExtractService();
