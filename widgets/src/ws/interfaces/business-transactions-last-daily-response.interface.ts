import { MessageResponseInterface } from './message-response.interface';

export interface BusinessTransactionsLastDailyResponseInterface extends MessageResponseInterface {
  id?: string;
  transactions?: any[];
}
