import { Document, Types } from 'mongoose';

export interface IBillPayable extends Document {
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
  status: 'pendente' | 'pago' | 'atrasado' | string;
  pago_em?: Date | null;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ICreateBillPayableDTO {
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

export interface IUpdateBillPayableDTO {
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
  pago_em?: Date | string | null;
}
