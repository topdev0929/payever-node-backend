import { MessageResponseInterface } from './message-response.interface';

export interface AdminTransactionsLastMonthlyResponseInterface extends MessageResponseInterface {
  transactions?: any[];
}
