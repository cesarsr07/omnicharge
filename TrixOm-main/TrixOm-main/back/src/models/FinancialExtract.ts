import { Schema, model } from 'mongoose';
import { IFinancialExtract } from '../types/financialExtract.types';

const FinancialExtractSchema = new Schema<IFinancialExtract>(
  {
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tipo: { type: String, enum: ['Entrada', 'Saida'], required: true },
    categoria: { type: String, default: '' },
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, default: '' },
    valor: { type: Number, required: true },
    data_vencimento: { type: Date, default: null },
    data_pagamento: { type: Date, default: null },
    status: { type: String, enum: ['Pendente', 'Pago', 'Atrasado'], default: 'Pendente' },
    codigo_pix: { type: String, default: '' },
    qr_code_url: { type: String, default: '' },
    origem_tipo: { type: String, default: '' },
    origem_id: { type: String, default: '' },
    nome_contato: { type: String, default: '' },
    criado_em: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

FinancialExtractSchema.index({ usuario_id: 1, tipo: 1, status: 1 });

export const FinancialExtract = model<IFinancialExtract>('FinancialExtract', FinancialExtractSchema);
