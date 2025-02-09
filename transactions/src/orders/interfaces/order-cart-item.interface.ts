import { OrderCartItemAttributesInterface } from './order-cart-item-attributes.interface';

export interface OrderCartItemInterface {
  identifier: string;
  name: string;
  brand?: string;
  quantity: number;
  sku?: string;
  unit_price: number;
  tax_rate?: number;
  total_amount: number;
  total_tax_amount?: number;
  description?: string;
  image_url?: string;
  product_url?: string;
  category?: string;
  attributes?: OrderCartItemAttributesInterface;
}
