import { Document } from 'mongoose';
import { ProductBaseInterface } from '../interfaces/product-base.interface';

export interface ProductBaseDocument extends ProductBaseInterface, Document {
  id: string;

  /** @deprecated */
  _id: string;
}
