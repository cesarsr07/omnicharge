import { Schema, model } from 'mongoose';
import { IBillPayable } from '../types/billPayable.types';

const BillPayableSchema = new Schema<IBillPayable>(
  {
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nome_devedor: { type: String, required: true, trim: true },
    apelido: { type: String, required: true, trim: true },
    descricao: { type: String, default: '' },
    valor: { type: Number, required: true },
    data_vencimento: { type: Date, required: true, index: true },
    contato: { type: String, default: '' },
    email: { type: String, default: '' },
    codigo_pagamento: { type: String, default: '' },
    qr_code_url: { type: String, default: '' },
    status: { type: String, enum: ['pendente', 'pago', 'atrasado'], default: 'pendente' },
    pago_em: { type: Date, default: null },
    criado_em: { type: Date, default: Date.now },
    atualizado_em: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
    versionKey: false,
  }
);

BillPayableSchema.index({ usuario_id: 1, status: 1 });

export const BillPayable = model<IBillPayable>('BillPayable', BillPayableSchema);
