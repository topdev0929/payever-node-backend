import { NotificationGroupInterface } from './notification-group.interface';

export interface NotificationInterface extends NotificationGroupInterface {
  message: string;
  data: { };
}
