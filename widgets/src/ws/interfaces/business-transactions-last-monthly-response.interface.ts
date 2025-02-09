import { MessageResponseInterface } from './message-response.interface';

export interface BusinessTransactionsLastMonthlyResponseInterface extends MessageResponseInterface {
  id?: string;
  transactions?: any[];
}
