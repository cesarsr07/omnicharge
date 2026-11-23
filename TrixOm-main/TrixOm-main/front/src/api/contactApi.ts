import { fetchApi } from './apiClient';
import { Contact, CreateContactInput } from '../types/contact';

export const contactApi = {
  listar: async (usuario_id: string, termo?: string): Promise<Contact[]> => {
    const query = termo ? `?usuario_id=${usuario_id}&termo=${encodeURIComponent(termo)}` : `?usuario_id=${usuario_id}`;
    return fetchApi<Contact[]>(`/contatos${query}`);
  },

  criar: async (dados: CreateContactInput): Promise<Contact> => {
    return fetchApi<Contact>('/contatos', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  editar: async (id: string, dados: Partial<Contact>): Promise<Contact> => {
    return fetchApi<Contact>(`/contatos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  excluir: async (id: string, usuario_id: string): Promise<void> => {
    await fetchApi(`/contatos/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ usuario_id }),
    });
  },
};
