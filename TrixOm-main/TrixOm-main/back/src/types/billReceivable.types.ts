import { Document, Types } from 'mongoose';

export interface IBillReceivable extends Document {
  usuario_id: Types.ObjectId;
  nome_devedor: string;
  apelido: string;
  descricao?: string;
  valor: number;
  data_vencimento: Date;
  contato?: string;
  email?: string;
  codigo_pagamento?: string;
  qr_code_url?: string;
  status: 'pendente' | 'recebido' | 'atrasado' | string;
  recebido_em?: Date | null;
  notificado_em?: Date | null;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ICreateBillReceivableDTO {
  usuario_id: string;
  nome_devedor: string;
  apelido: string;
  descricao?: string;
  valor: number;
  data_vencimento: Date | string;
  contato?: string;
  email?: string;
  codigo_pagamento?: string;
  qr_code_url?: string;
  status?: string;
}

export interface IUpdateBillReceivableDTO {
  nome_devedor?: string;
  apelido?: string;
  descricao?: string;
  valor?: number;
  data_vencimento?: Date | string;
  contato?: string;
  email?: string;
  codigo_pagamento?: string;
  qr_code_url?: string;
  status?: string;
  recebido_em?: Date | string | null;
  notificado_em?: Date | string | null;
}
