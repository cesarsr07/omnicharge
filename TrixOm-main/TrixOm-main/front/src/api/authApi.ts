import { fetchApi } from './apiClient';
import { User } from '../types/auth';

export const authApi = {
  login: async (email: string, senha_hash: string): Promise<User> => {
    const usuarios = await fetchApi<User[]>(`/usuarios?email=${encodeURIComponent(email)}`);
    if (usuarios && usuarios.length > 0) {
      return usuarios[0];
    }
    throw new Error('Usuário não encontrado com este e-mail');
  },

  register: async (dados: { nome: string; email: string; telefone: string; senha_hash: string }): Promise<User> => {
    return fetchApi<User>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  updateProfile: async (id: string, dados: { nome?: string; telefone?: string }): Promise<User> => {
    return fetchApi<User>(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },
};
