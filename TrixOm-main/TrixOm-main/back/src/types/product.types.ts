import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  usuario_id: Types.ObjectId;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  qualidade: 'Nova' | 'Usada' | string;
  descricao?: string;
  tipo_atribuicao?: string;
  responsavel?: string;
  data_devolucao?: Date | null;
  foto?: string;
  status: 'disponivel' | 'indisponivel' | string;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ICreateProductDTO {
  usuario_id: string;
  nome: string;
  categoria: string;
  preco?: number;
  quantidade?: number;
  qualidade?: string;
  descricao?: string;
  tipo_atribuicao?: string;
  responsavel?: string;
  data_devolucao?: Date | string | null;
  foto?: string;
  status?: string;
}

export interface IUpdateProductDTO {
  nome?: string;
  categoria?: string;
  preco?: number;
  quantidade?: number;
  qualidade?: string;
  descricao?: string;
  tipo_atribuicao?: string;
  responsavel?: string;
  data_devolucao?: Date | string | null;
  foto?: string;
  status?: string;
}
