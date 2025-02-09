import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business/schemas';
import { UserAttributeGroupSchemaName } from './user-attribute-group.schema';

export const UserAttributeSchemaName: string = 'UserAttribute';
export const UserAttributeSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    icon: String,
    name: String,
    type: { type: String },

    filterAble: Boolean,
    onlyAdmin: Boolean,
    showOn: [String],

    defaultValue: String,
    userAttributeGroup: { type: String, ref: UserAttributeGroupSchemaName },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ _id: 1, businessId: 1 })
  .index({ userAttributeGroup: 1 })
  .index({ businessId: 1, name: 1, type: 1 }, { unique: true })
  ;


UserAttributeSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
