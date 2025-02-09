import { NotificationGroupInterface } from './notification-group.interface';

export interface NotificationsCanceledPayloadInterface extends NotificationGroupInterface {
  ids: string[];
  token: string;
}
