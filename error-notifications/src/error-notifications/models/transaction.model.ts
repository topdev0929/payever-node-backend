import { Document } from 'mongoose';
import { TransactionInterface } from '../interfaces';

export interface TransactionModel extends TransactionInterface, Document {
}
