import { Document, Types } from 'mongoose';
import { ChannelSetLastSoldProductsListInterface } from '../interfaces';
import { ProductModel } from './product.model';

export interface ChannelSetLastSoldProductsListModel extends ChannelSetLastSoldProductsListInterface, Document {
  products: Types.DocumentArray<ProductModel>;
}
