import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.types';

const UserSchema = new Schema<IUser>(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefone: { type: String, default: '' },
    senha_hash: { type: String, required: true },
    tipo: { type: String, default: 'cliente' },
    criado_em: { type: Date, default: Date.now },
    atualizado_em: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
    versionKey: false,
  }
);

export const User = model<IUser>('User', UserSchema);
