export interface User {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: string;
  criado_em?: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}
