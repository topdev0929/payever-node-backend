import { ProductInterface } from '../interfaces/product.interface';
import { ProductBaseDocument } from './product-base.document';

export interface ProductDocument extends ProductBaseDocument, ProductInterface {
  title: string;
}
