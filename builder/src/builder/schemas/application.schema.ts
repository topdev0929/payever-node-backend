import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';

export const ApplicationSchemaName: string = process.env.APPLICATION_SCHEMA_NAME;
export const ApplicationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    builderVersion: { type: Schema.Types.String, default: 2 },
    business: { type: Schema.Types.String, required: true, ref: BusinessSchemaName },
    email: { type: String },
    name: { type: String },
    title: { type: String },
  },
  {
    timestamps: { },
  },
);

ApplicationSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});
