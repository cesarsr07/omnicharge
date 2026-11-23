import { Schema, model } from 'mongoose';
import { IStockMovement } from '../types/stockMovement.types';

const StockMovementSchema = new Schema<IStockMovement>(
  {
    produto_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tipo: { type: String, enum: ['entrada', 'saida'], required: true },
    quantidade: { type: Number, required: true },
    valor_total: { type: Number, default: 0.0 },
    data_movimentacao: { type: Date, default: Date.now },
    status: { type: String, default: 'ativo' },
    observacao: { type: String, default: '' },
  },
  {
    versionKey: false,
  }
);

export const StockMovement = model<IStockMovement>('StockMovement', StockMovementSchema);
