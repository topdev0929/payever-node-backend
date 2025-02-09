import { MessageResponseInterface } from './message-response.interface';

export interface TransactionsLastMonthlyResponseInterface extends MessageResponseInterface {
  id?: string;
  transactions?: any[];
}
