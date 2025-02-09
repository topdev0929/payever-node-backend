import { Document } from 'mongoose';
import { TransactionHistoryEntryInterface } from '../../interfaces/transaction';

export interface HistoryCommonModel extends TransactionHistoryEntryInterface, Document {
}
