/* eslint-disable @typescript-eslint/tslint/config */
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { OrderAddressSchema } from './order-address.schema';
import { OrderCustomerSchema } from './order-customer.schema';
import { OrderPurchaseSchema } from './order-purchase.schema';
import { OrderCartItemSchema } from './order-cart-item.schema';

export const OrderSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    business_id: { type: String, required: true },
    cart: { type: [OrderCartItemSchema], required: false },
    customer: { type: OrderCustomerSchema, required: true },
    purchase: { type: OrderPurchaseSchema, required: true },
    reference: { type: String, required: true },

    billing_address: { type: OrderAddressSchema, required: true },
    shipping_address: { type: OrderAddressSchema, required: false },

    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
  },
);
