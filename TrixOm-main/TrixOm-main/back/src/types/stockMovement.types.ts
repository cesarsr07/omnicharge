import { Document, Types } from 'mongoose';

export interface IStockMovement extends Document {
  produto_id: Types.ObjectId;
  usuario_id: Types.ObjectId;
  tipo: 'entrada' | 'saida' | string;
  quantidade: number;
  valor_total: number;
  data_movimentacao: Date;
  status: 'ativo' | 'cancelado' | string;
  observacao?: string;
}

export interface ICreateStockMovementDTO {
  produto_id: string;
  usuario_id: string;
  tipo: 'entrada' | 'saida' | string;
  quantidade: number;
  valor_total?: number;
  observacao?: string;
}
