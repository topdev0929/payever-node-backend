import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PaymentItemSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    description: {
      required: false,
      type: Schema.Types.String,
    },
    extra_data: {
      required: false,
      type: Schema.Types.Mixed,
    },
    identifier: {
      required: false,
      type: Schema.Types.String,
    },
    name: {
      required: true,
      type: Schema.Types.String,
    },
    options: {
      required: false,
      type: Schema.Types.Mixed,
    },
    price: {
      required: true,
      type: Schema.Types.Number,
    },
    price_net: {
      required: false,
      type: Schema.Types.Number,
    },
    product_id: {
      required: false,
      type: Schema.Types.String,
    },
    quantity: {
      required: true,
      type: Schema.Types.Number,
    },
    sku: {
      required: false,
      type: Schema.Types.String,
    },
    thumbnail: {
      required: false,
      type: Schema.Types.String,
    },
    url: {
      required: false,
      type: Schema.Types.String,
    },
    vat_rate: {
      required: false,
      type: Schema.Types.Number,
    },
  },
);
