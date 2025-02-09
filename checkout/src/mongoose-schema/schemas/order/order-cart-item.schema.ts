import { Schema } from 'mongoose';
import { OrderCartItemAttributesSchema } from './order-cart-item-attributes.schema';

export const OrderCartItemSchema: Schema = new Schema(
  {
    attributes: { type: OrderCartItemAttributesSchema, required: false },
    brand: { type: String, required: false },
    category: { type: String, required: false },
    description: { type: String, required: false },
    identifier: { type: String, required: true },
    image_url: { type: String, required: false },
    name: { type: String, required: true },
    product_url: { type: String, required: false },
    quantity: { type: Number, required: true },
    sku: { type: String, required: false },
    tax_rate: { type: Number, required: false },
    total_amount: { type: Number, required: true },
    total_tax_amount: { type: Number, required: false },
    unit_price: { type: Number, required: true },
  },
  {
    _id: false,
  },
);
