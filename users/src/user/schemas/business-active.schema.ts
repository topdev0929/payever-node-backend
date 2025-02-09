import { Schema } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { v4 as uuid } from 'uuid';
import { UserSchemaName } from './user.schema';
import { BusinessSchemaName } from './business.schema';

export const BusinessActiveSchemaName: string = 'BusinessActive';
export const BusinessActiveSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    owner: { ref: UserSchemaName, type: String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ owner: 1 }, { unique: true })
  .index({ createdAt: 1 })
  .index({ updatedAt: 1 })
  .index({ name: 1 })
  .plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });

BusinessActiveSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
