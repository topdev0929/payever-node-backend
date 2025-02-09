import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business/schemas';

export const UserAttributeGroupSchemaName: string = 'UserAttributeGroup';
export const UserAttributeGroupSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    name: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ _id: 1, businessId: 1 })
  .index({ businessId: 1, name: 1 }, { unique: true })
  ;

UserAttributeGroupSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
