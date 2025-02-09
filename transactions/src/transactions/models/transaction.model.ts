import { Document, Types } from 'mongoose';
import { TransactionPackedDetailsInterface } from '../interfaces/transaction';
import { AddressModel } from './address.model';
import { TransactionCartItemModel } from './transaction-cart-item.model';
import { HistoryCommonModel } from './history/history-common.model';

export interface TransactionModel extends TransactionPackedDetailsInterface, Document {
  id: string;
  billing_address: AddressModel;
  history: Types.DocumentArray<HistoryCommonModel>;
  historyIds: string[];

  captured_items?: Types.DocumentArray<TransactionCartItemModel>;
  items: Types.DocumentArray<TransactionCartItemModel>;
  refunded_items?: Types.DocumentArray<TransactionCartItemModel>;

  shipping_address: AddressModel;

  anonymized?: boolean;
}
