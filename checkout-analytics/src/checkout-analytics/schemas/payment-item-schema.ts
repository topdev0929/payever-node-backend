import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PaymentItemSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  createdAt: {
    required: true,
    type: Date,
  },
  extraData: {
    required: false,
    type: Schema.Types.Mixed,
  },
  identifier: {
    required: false,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  options: {
    required: false,
    type: Schema.Types.Mixed,
  },
  price: {
    required: true,
    type: Number,
  },
  priceNet: {
    required: false,
    type: Number,
  },
  productId: {
    required: false,
    type: String,
  },
  quantity: {
    required: true,
    type: Number,
  },
  sku: {
    required: false,
    type: String,
  },
  updatedAt: {
    required: false,
    type: Date,
  },
  vatRate: {
    required: false,
    type: Number,
  },
});
