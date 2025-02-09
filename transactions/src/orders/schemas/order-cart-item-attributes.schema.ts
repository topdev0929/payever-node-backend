import { Schema } from 'mongoose';
import { OrderCartItemAttributesDimensionsSchema } from './order-cart-item-attributes-dimensions.schema';

export const OrderCartItemAttributesSchema: Schema = new Schema(
  {
    dimensions: { type: OrderCartItemAttributesDimensionsSchema, required: false },
    weight: { type: Number, required: false },
  },
  {
    _id: false,
  },
);
