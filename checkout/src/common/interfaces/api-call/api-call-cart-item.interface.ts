import { ApiCallCartItemAttributesInterface } from './api-call-cart-item-attributes.interface';
import { CartItemTypeEnum } from '../../../common/enum';

export interface ApiCallCartItemInterface {
  description?: string;
  extra_data?: { };
  identifier: string;
  name: string;
  price: number;
  price_netto?: number;
  quantity: number;
  sku?: string;
  thumbnail?: string;
  url?: string;
  vat_rate?: number;

  brand?: string;
  total_amount?: number;
  total_tax_amount?: number;
  total_discount_amount?: number;
  image_url?: string;
  product_url?: string;
  category?: string;
  attributes?: ApiCallCartItemAttributesInterface;
  type?: CartItemTypeEnum;
}
