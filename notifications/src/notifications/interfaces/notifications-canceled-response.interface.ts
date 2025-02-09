import { MessageResponseInterface } from './message-response.interface';

export interface NotificationsCanceledResponseInterface extends MessageResponseInterface {
  ids?: string[];
}
