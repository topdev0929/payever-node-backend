import { Document, Types } from 'mongoose';
import { TransactionPackedDetailsInterface } from '../interfaces/transaction/example';
import { AddressModel } from './address.model';
import { TransactionCartItemModel } from './transaction-cart-item.model';
import { HistoryCommonModel } from './history/history-common.model';

export interface TransactionExampleModel extends TransactionPackedDetailsInterface, Document {
  id: string;
  billing_address: AddressModel;
  history: Types.DocumentArray<HistoryCommonModel>;
  items: Types.DocumentArray<TransactionCartItemModel>;
  shipping_address: AddressModel;
}
