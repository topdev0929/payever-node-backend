// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';

export const ProductDeliverySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    measure_duration: {
      type: String,
      enum: ['day', 'week', 'month'],
      default: 'day',
    },
  },
  {
    _id: false,
  },
);
