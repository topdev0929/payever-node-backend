import { MessageResponseInterface } from './message-response.interface';
import { NotificationInterface } from './notification.interface';

export interface NotificationsResponseInterface extends MessageResponseInterface {
  notifications?: NotificationInterface[];
  total?: number;
}
