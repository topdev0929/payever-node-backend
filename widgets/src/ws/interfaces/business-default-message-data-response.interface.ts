import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultMessageDataResponseInterface extends MessageResponseInterface {
  id: string;
  chats?: any[];
}
