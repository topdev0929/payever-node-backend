import { SampleProductShippingInterface } from './sample-product-shipping.interface';
import { ProductTypeEnum } from '../../../src/products/enums';

export interface SampleProductInterface {
  businessId: string;
  images: string[];
  currency?: string;
  title: string;
  description: string;
  onSales: boolean;
  price: number;
  vatRate?: number;
  salePrice: number;
  sku: string;
  barcode: string;
  type: ProductTypeEnum;
  active: boolean;
  shipping?: SampleProductShippingInterface;
  example: boolean;
  industry: string;
  product: string;
}
