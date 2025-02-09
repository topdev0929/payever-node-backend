import { MessageResponseInterface } from './message-response.interface';

export interface AdminTransactionsLastDailyResponseInterface extends MessageResponseInterface {
  transactions?: any[];
}
