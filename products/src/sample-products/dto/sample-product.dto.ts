import { ProductTypeEnum } from '../../products/enums';
import { ProductShippingDto } from '../../products/dto';

export interface SampleProductDto {
  _id: string;
  businessUuid: string;
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
  shipping?: ProductShippingDto;
  example: boolean;
  industry: string;
  product: string;
}
