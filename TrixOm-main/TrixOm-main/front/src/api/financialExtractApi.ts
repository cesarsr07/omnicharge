import { fetchApi } from './apiClient';
import { FinancialBalance, FinancialExtractItem } from '../types/extract';

export const financialExtractApi = {
  listar: async (usuario_id: string, tipo?: string, status?: string, mes?: number, ano?: number): Promise<FinancialExtractItem[]> => {
    const params = new URLSearchParams({ usuario_id });
    if (tipo) params.append('tipo', tipo);
    if (status) params.append('status', status);
    if (mes) params.append('mes', mes.toString());
    if (ano) params.append('ano', ano.toString());
    return fetchApi<FinancialExtractItem[]>(`/extrato?${params.toString()}`);
  },

  obterBalanco: async (usuario_id: string, mes?: number, ano?: number): Promise<FinancialBalance> => {
    const params = new URLSearchParams({ usuario_id });
    if (mes) params.append('mes', mes.toString());
    if (ano) params.append('ano', ano.toString());
    return fetchApi<FinancialBalance>(`/extrato/balanco?${params.toString()}`);
  },
};
