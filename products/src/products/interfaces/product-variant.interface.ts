import { OptionInterface, ProductSaleInterface } from '../interfaces';

import { ProductAttributeInterface } from './product-attribute.interface';
import { ProductPriceInterface } from './product-price.interface';

export interface ProductVariantInterface {
  apps: string[];
  barcode: string;
  businessId: string;
  description: string;
  images?: string[];
  imagesUrl?: string[];
  isLocked: boolean;
  /** @deprecated */
  options: OptionInterface[];
  attributes: ProductAttributeInterface[];
  price: number;
  priceTable?: ProductPriceInterface[];
  product: string;
  sale?: ProductSaleInterface;
  sku: string;
  title: string;
}
