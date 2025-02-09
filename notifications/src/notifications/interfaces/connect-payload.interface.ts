import { NotificationGroupInterface } from './notification-group.interface';

export interface ConnectPayloadInterface extends NotificationGroupInterface {
  id?: string;
  token: string;
}
