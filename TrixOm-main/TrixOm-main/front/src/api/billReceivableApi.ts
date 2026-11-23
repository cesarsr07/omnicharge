import { fetchApi } from './apiClient';
import { BillReceivable, CreateBillInput } from '../types/bill';

export const billReceivableApi = {
  listar: async (usuario_id: string, status?: string): Promise<BillReceivable[]> => {
    const params = new URLSearchParams({ usuario_id });
    if (status) params.append('status', status);
    return fetchApi<BillReceivable[]>(`/contas-receber?${params.toString()}`);
  },

  criar: async (dados: CreateBillInput): Promise<BillReceivable> => {
    return fetchApi<BillReceivable>('/contas-receber', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  editar: async (id: string, usuario_id: string, dados: Partial<BillReceivable>): Promise<BillReceivable> => {
    return fetchApi<BillReceivable>(`/contas-receber/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ usuario_id, ...dados }),
    });
  },

  excluir: async (id: string, usuario_id: string): Promise<void> => {
    await fetchApi(`/contas-receber/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ usuario_id }),
    });
  },

  marcarComoRecebido: async (id: string, usuario_id: string): Promise<BillReceivable> => {
    return fetchApi<BillReceivable>(`/contas-receber/${id}/receber`, {
      method: 'POST',
      body: JSON.stringify({ usuario_id }),
    });
  },
};
