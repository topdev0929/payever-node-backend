import { Schema, VirtualType } from 'mongoose';
import { BusinessSchemaName } from '../../statistics/schemas/business.schema';
import { v4 as uuid } from 'uuid';

export const ShopSchemaName: string = 'Shop';
export const ShopSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    business: { type: String, required: true, ref: BusinessSchemaName },
    domain: {  type: String, required: true},
    isDefault: { type: Boolean, required: true },
  },
  {
    minimize: false,
    timestamps: { },
    toJSON: { virtuals: true },
  },
);

ShopSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});
