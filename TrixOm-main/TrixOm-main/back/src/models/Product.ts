import { Schema, model } from 'mongoose';
import { IProduct } from '../types/product.types';

const ProductSchema = new Schema<IProduct>(
  {
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    preco: { type: Number, default: 0.0 },
    quantidade: { type: Number, default: 0 },
    qualidade: { type: String, default: 'Nova' },
    descricao: { type: String, default: '' },
    tipo_atribuicao: { type: String, default: 'Venda' },
    responsavel: { type: String, default: '' },
    data_devolucao: { type: Date, default: null },
    foto: { type: String, default: '' },
    status: { type: String, default: 'disponivel' },
    criado_em: { type: Date, default: Date.now },
    atualizado_em: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
    versionKey: false,
  }
);

ProductSchema.index({ usuario_id: 1, categoria: 1 });
ProductSchema.index({ usuario_id: 1, nome: 1 });

export const Product = model<IProduct>('Product', ProductSchema);
