import { Types, Document, LeanDocument } from 'mongoose';
import { ProductVariantInterface } from '../interfaces';
import { OptionDocument } from './option.document';
import { ProductModel } from './product.model';

export interface ProductVariantModel extends ProductVariantInterface, Document<string> {
  _id: string;
  /** @deprecated */
  options: Types.DocumentArray<OptionDocument>;
}

export interface LeanProductVariant extends LeanDocument<ProductVariantModel> { }

export type PopulatedProductVariantModel1 =
  Omit<ProductVariantModel, 'product'> &
  {
    product: ProductModel;
  };
