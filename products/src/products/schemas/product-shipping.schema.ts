// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';

export const ProductShippingSchema: Schema = new Schema(
  {
    free: Boolean,
    general: Boolean,
    weight: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    measure_mass: {
      type: String,
      enum: ['mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't'],
      default: 'kg',
    },
    measure_size: {
      type: String,
      enum: ['mm', 'cm', 'm', 'in', 'ft-us', 'ft', 'mi'],
      default: 'cm',
    },
  },
  {
    _id: false,
  });
