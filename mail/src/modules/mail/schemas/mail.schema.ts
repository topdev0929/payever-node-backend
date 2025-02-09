import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const MailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

MailSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});

MailSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
