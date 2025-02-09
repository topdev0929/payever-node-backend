import { CheckoutTransactionHistoryItemInterface } from '../checkout';
import { TransactionCartItemInterface } from './transaction-cart-item.interface';

export interface TransactionPaymentInterface {
  amount: number;
  business: {
    id: string;
  };
  customer: {
    email: string;
    name: string;
  };
  user: {
    id: string;
  };
  channel_set: {
    id: string;
  };
  date: Date;
  id: string;
  items: TransactionCartItemInterface[];
  last_updated: Date;
  history?: CheckoutTransactionHistoryItemInterface[];
}
