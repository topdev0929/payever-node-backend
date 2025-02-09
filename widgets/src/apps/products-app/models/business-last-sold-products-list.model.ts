import { Document, Types } from 'mongoose';
import { BusinessLastSoldProductsListInterface } from '../interfaces';
import { ProductModel } from './product.model';

export interface BusinessLastSoldProductsListModel extends BusinessLastSoldProductsListInterface, Document {
  products: Types.DocumentArray<ProductModel>;
}
