import { MessageResponseInterface } from './message-response.interface';

export interface BusinessStudioAppLastResponseInterface extends MessageResponseInterface {
  id: string;
  media?: any[];
}
