import { Document } from 'mongoose';

export interface IUser extends Document {
  nome: string;
  email: string;
  telefone?: string;
  senha_hash: string;
  tipo: 'cliente' | 'admin' | string;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ICreateUserDTO {
  nome: string;
  email: string;
  telefone?: string;
  senha_hash: string;
  tipo?: string;
}

export interface IUpdateUserDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  tipo?: string;
  senha_hash?: string;
}
