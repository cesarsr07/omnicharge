import { fetchApi } from './apiClient';
import { CreateProductInput, Product, StockMovement } from '../types/product';

export const productApi = {
  listar: async (usuario_id: string, categoria?: string, status?: string): Promise<Product[]> => {
    const params = new URLSearchParams({ usuario_id });
    if (categoria) params.append('categoria', categoria);
    if (status) params.append('status', status);
    return fetchApi<Product[]>(`/produtos?${params.toString()}`);
  },

  adicionar: async (dados: CreateProductInput): Promise<Product> => {
    return fetchApi<Product>('/produtos', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  editar: async (id: string, usuario_id: string, dados: Partial<Product>): Promise<Product> => {
    return fetchApi<Product>(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ usuario_id, ...dados }),
    });
  },

  excluir: async (id: string, usuario_id: string): Promise<void> => {
    await fetchApi(`/produtos/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ usuario_id }),
    });
  },

  vender: async (id: string, usuario_id: string, quantidade: number, cliente_id: string): Promise<{ produto: Product; movimentacao: StockMovement }> => {
    return fetchApi(`/produtos/${id}/vender`, {
      method: 'POST',
      body: JSON.stringify({ usuario_id, quantidade, cliente_id }),
    });
  },

  emprestar: async (id: string, usuario_id: string, quantidade: number, cliente_id: string, dias_emprestimo?: number): Promise<{ produto: Product; movimentacao: StockMovement }> => {
    return fetchApi(`/produtos/${id}/emprestar`, {
      method: 'POST',
      body: JSON.stringify({ usuario_id, quantidade, cliente_id, dias_emprestimo }),
    });
  },

  devolver: async (movimentacao_id: string): Promise<{ produto: Product; movimentacao: StockMovement }> => {
    return fetchApi(`/produtos/devolver`, {
      method: 'POST',
      body: JSON.stringify({ movimentacao_id }),
    });
  },
};
