import { Schema } from 'mongoose';

export const shippingSchema: Schema = new Schema(
  {
    free: Boolean,
    general: Boolean,
    height: {
      required: true,
      type: Number,
    },
    length: {
      required: true,
      type: Number,
    },
    measure_mass: {
      default: 'kg',
      enum: ['mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't'],
      type: String,
    },
    measure_size: {
      default: 'cm',
      enum: ['mm', 'cm', 'm', 'in', 'ft-us', 'ft', 'mi'],
      type: String,
    },
    weight: {
      required: true,
      type: Number,
    },
    width: {
      required: true,
      type: Number,
    },
  },
  {
    _id: false,
  },
);
