export interface Contact {
  _id: string;
  usuario_id: string;
  nome: string;
  tipo: 'Ambos' | 'Devedor' | 'Credor' | string;
  telefone?: string;
  email?: string;
  observacao?: string;
  criado_em?: string;
}

export interface CreateContactInput {
  usuario_id: string;
  nome: string;
  tipo?: string;
  telefone?: string;
  email?: string;
  observacao?: string;
}
