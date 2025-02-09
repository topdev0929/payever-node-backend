import { MessageResponseInterface } from './message-response.interface';

export interface BusinessWidgetsResponseInterface extends MessageResponseInterface {
  id: string;
  widgets?: any[];
}
