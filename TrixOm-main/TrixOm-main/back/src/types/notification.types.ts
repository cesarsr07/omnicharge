import { Document, Types } from 'mongoose';

export interface INotification extends Document {
  conta_receber_id?: Types.ObjectId;
  tipo?: string;
  destinatario: string;
  mensagem: string;
  enviado_em: Date;
  status: string;
}

export interface ICreateNotificationDTO {
  conta_receber_id?: string;
  tipo?: string;
  destinatario: string;
  mensagem: string;
  status?: string;
}
