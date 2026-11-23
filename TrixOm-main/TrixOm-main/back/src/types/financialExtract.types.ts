import { Document, Types } from 'mongoose';

export interface IFinancialExtract extends Document {
  usuario_id: Types.ObjectId;
  tipo: 'Entrada' | 'Saida';
  categoria?: string;
  titulo: string;
  descricao?: string;
  valor: number;
  data_vencimento?: Date;
  data_pagamento?: Date;
  status: 'Pendente' | 'Pago' | 'Atrasado';
  codigo_pix?: string;
  qr_code_url?: string;
  origem_tipo?: string;
  origem_id?: string;
  nome_contato?: string;
  criado_em: Date;
}

export interface ICreateFinancialExtractDTO {
  usuario_id: string;
  tipo: 'Entrada' | 'Saida';
  categoria?: string;
  titulo: string;
  descricao?: string;
  valor: number;
  data_vencimento?: Date | string;
  data_pagamento?: Date | string;
  status?: 'Pendente' | 'Pago' | 'Atrasado';
  codigo_pix?: string;
  qr_code_url?: string;
  origem_tipo?: string;
  origem_id?: string;
  nome_contato?: string;
}
