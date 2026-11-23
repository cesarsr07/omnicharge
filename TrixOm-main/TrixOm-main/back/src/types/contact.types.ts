import { Document, Types } from 'mongoose';

export interface IContact extends Document {
  usuario_id: Types.ObjectId;
  nome: string;
  tipo: 'Ambos' | 'Devedor' | 'Credor' | string;
  telefone?: string;
  email?: string;
  observacao?: string;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ICreateContactDTO {
  usuario_id: string;
  nome: string;
  tipo?: string;
  telefone?: string;
  email?: string;
  observacao?: string;
}

export interface IUpdateContactDTO {
  nome?: string;
  tipo?: string;
  telefone?: string;
  email?: string;
  observacao?: string;
}
