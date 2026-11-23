import { Schema, model } from 'mongoose';
import { IBillReceivable } from '../types/billReceivable.types';

const BillReceivableSchema = new Schema<IBillReceivable>(
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
    status: { type: String, enum: ['pendente', 'recebido', 'atrasado'], default: 'pendente' },
    recebido_em: { type: Date, default: null },
    notificado_em: { type: Date, default: null },
    criado_em: { type: Date, default: Date.now },
    atualizado_em: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
    versionKey: false,
  }
);

BillReceivableSchema.index({ usuario_id: 1, status: 1 });

export const BillReceivable = model<IBillReceivable>('BillReceivable', BillReceivableSchema);
