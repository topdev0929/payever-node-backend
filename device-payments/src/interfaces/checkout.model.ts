import { Document } from 'mongoose';
import { CheckoutInterface } from './checkout.interface';

export interface CheckoutModel extends CheckoutInterface, Document {
  _id: any;
}
