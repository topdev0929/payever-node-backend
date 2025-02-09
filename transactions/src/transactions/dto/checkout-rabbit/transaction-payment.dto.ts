import { CheckoutTransactionHistoryItemInterface } from '../../../transactions/interfaces/checkout';
import { TransactionPaymentInterface } from '../../interfaces/transaction/';
import { TransactionCartItemDto } from './transaction-cart-item.dto';


export class TransactionPaymentDto implements TransactionPaymentInterface {
  public amount: number;
  public business: {
    id: string;
  };
  public customer: {
    email: string;
    name: string;
  };
  public user: {
    id: string;
  };
  public channel_set: {
    id: string;
  };
  public date: Date;
  public id: string;
  public items: TransactionCartItemDto[];
  public last_updated: Date;
  public history: CheckoutTransactionHistoryItemInterface[];
}

