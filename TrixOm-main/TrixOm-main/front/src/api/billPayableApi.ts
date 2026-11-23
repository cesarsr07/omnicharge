import { fetchApi } from './apiClient';
import { BillPayable, CreateBillInput } from '../types/bill';

export const billPayableApi = {
  listar: async (usuario_id: string, status?: string): Promise<BillPayable[]> => {
    const params = new URLSearchParams({ usuario_id });
    if (status) params.append('status', status);
    return fetchApi<BillPayable[]>(`/contas-pagar?${params.toString()}`);
  },

  criar: async (dados: CreateBillInput): Promise<BillPayable> => {
    return fetchApi<BillPayable>('/contas-pagar', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  editar: async (id: string, usuario_id: string, dados: Partial<BillPayable>): Promise<BillPayable> => {
    return fetchApi<BillPayable>(`/contas-pagar/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ usuario_id, ...dados }),
    });
  },

  excluir: async (id: string, usuario_id: string): Promise<void> => {
    await fetchApi(`/contas-pagar/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ usuario_id }),
    });
  },

  marcarComoPago: async (id: string, usuario_id: string): Promise<BillPayable> => {
    return fetchApi<BillPayable>(`/contas-pagar/${id}/pagar`, {
      method: 'POST',
      body: JSON.stringify({ usuario_id }),
    });
  },
};
