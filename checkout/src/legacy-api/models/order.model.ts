import { Document } from 'mongoose';
import { OrderInterface } from '../interfaces';
import { OrderCartItemModel } from './order-cart-item.model';

export interface OrderModel extends OrderInterface, Document {
  cart: OrderCartItemModel[];
}
