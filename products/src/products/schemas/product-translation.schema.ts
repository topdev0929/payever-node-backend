// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ProductTranslationSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: Schema.Types.String },
    product: { ref: 'products', type: Schema.Types.String },
    translations: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
).index({ product: 1 }, { unique: true });
