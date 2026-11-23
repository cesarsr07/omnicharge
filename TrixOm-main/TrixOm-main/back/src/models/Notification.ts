import { Schema, model } from 'mongoose';
import { INotification } from '../types/notification.types';

const NotificationSchema = new Schema<INotification>(
  {
    conta_receber_id: { type: Schema.Types.ObjectId, ref: 'BillReceivable', default: null },
    tipo: { type: String, default: 'Lembrete' },
    destinatario: { type: String, required: true },
    mensagem: { type: String, required: true },
    enviado_em: { type: Date, default: Date.now },
    status: { type: String, default: 'enviado' },
  },
  {
    versionKey: false,
  }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
