import { Document } from 'mongoose';
import { PaymentInterface } from '../interfaces';

export interface PaymentModel extends PaymentInterface, Document {
}
