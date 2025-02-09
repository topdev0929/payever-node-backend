import { MessageResponseInterface } from './message-response.interface';

export interface TransactionsLastDailyResponseInterface extends MessageResponseInterface {
  id?: string;
  transactions?: any[];
}
