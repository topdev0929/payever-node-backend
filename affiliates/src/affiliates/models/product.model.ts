import { BusinessModel } from '@pe/business-kit';
import { ProductInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface ProductModel extends ProductInterface, Document {
  business: BusinessModel | string;
}
