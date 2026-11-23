import { Schema, model } from 'mongoose';
import { IContact } from '../types/contact.types';

const ContactSchema = new Schema<IContact>(
  {
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    tipo: { type: String, enum: ['Ambos', 'Devedor', 'Credor'], default: 'Ambos' },
    telefone: { type: String, default: '' },
    email: { type: String, default: '' },
    observacao: { type: String, default: '' },
    criado_em: { type: Date, default: Date.now },
    atualizado_em: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
    versionKey: false,
  }
);

// Índice composto para busca eficiente por usuário e nome
ContactSchema.index({ usuario_id: 1, nome: 1 });

export const Contact = model<IContact>('Contact', ContactSchema);
