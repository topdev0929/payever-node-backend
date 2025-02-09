import { OrderPurchaseInterface } from './order-purchase.interface';
import { OrderCustomerInterface } from './order-customer.interface';
import { OrderAddressInterface } from './order-address.interface';
import { OrderCartItemInterface } from './order-cart-item.interface';

export interface OrderInterface {
  business_id: string;
  reference: string;
  purchase: OrderPurchaseInterface;
  customer: OrderCustomerInterface;
  cart: OrderCartItemInterface[];
  billing_address?: OrderAddressInterface;
  shipping_address?: OrderAddressInterface;
  created_at: Date;
  updated_at: Date;
}
