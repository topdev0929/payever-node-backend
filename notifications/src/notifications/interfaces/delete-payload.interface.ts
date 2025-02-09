import { NotificationGroupInterface } from './notification-group.interface';

export interface DeletePayloadInterface extends NotificationGroupInterface {
  id: string;
  token: string;
}
