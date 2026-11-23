import { Notification } from '../models/Notification';
import { ICreateNotificationDTO, INotification } from '../types/notification.types';

export class NotificationService {
  async criar(dados: ICreateNotificationDTO): Promise<INotification> {
    const notificacao = new Notification(dados);
    return notificacao.save();
  }

  async listarPorContaReceber(conta_receber_id: string): Promise<INotification[]> {
    return Notification.find({ conta_receber_id }).sort({ enviado_em: -1 });
  }

  async listarTodas(): Promise<INotification[]> {
    return Notification.find().sort({ enviado_em: -1 });
  }
}

export const notificationService = new NotificationService();
