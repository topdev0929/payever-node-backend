import { MessageResponseInterface } from './message-response.interface';

export interface WidgetsResponseInterface extends MessageResponseInterface {
  id?: string;
  widgets?: any[];
}
