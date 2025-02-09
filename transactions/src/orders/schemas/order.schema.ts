import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { OrderCustomerSchema } from './order-customer.schema';
import { OrderPurchaseSchema } from './order-purchase.schema';
import { OrderAddressSchema } from './order-address.schema';
import { OrderCartItemSchema } from './order-cart-item.schema';
import { TransactionSchemaName } from '../../transactions/schemas';

export const OrderSchemaName: string = 'Order';

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

    status: { type: String },
    transactions: [{ type: String, ref: TransactionSchemaName}],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

OrderSchema.index({ reference: 1 });
OrderSchema.index({ business_id: 1 });
OrderSchema.index({ created_at: -1 });
OrderSchema.index({ created_at: 1 });
