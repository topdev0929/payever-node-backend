import { OrderStatusesEnum } from '../enum';
import { OrderPurchaseInterface } from './order-purchase.interface';
import { OrderCustomerInterface } from './order-customer.interface';
import { OrderAddressInterface } from './order-address.interface';
import { OrderCartItemInterface } from './order-cart-item.interface';
import { TransactionBasicInterface } from '../../transactions/interfaces';

export interface OrderInterface {
  business_id: string;
  purchase: OrderPurchaseInterface;
  customer: OrderCustomerInterface;
  cart?: OrderCartItemInterface[];
  reference: string;
  billing_address?: OrderAddressInterface;
  shipping_address?: OrderAddressInterface;
  created_at: Date;
  updated_at: Date;

  status: OrderStatusesEnum;
  transactions: TransactionBasicInterface[];
}
