import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultSubscriptionDataResponseInterface extends MessageResponseInterface {
  id: string;
  subscribed?: number;
  total?:  number;
  unsubscribed?:  number;
}
