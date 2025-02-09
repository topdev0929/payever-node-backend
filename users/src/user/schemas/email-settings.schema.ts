import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const EmailSettingsSchemaName: string = 'EmailSettingsSchemaName';
export const EmailSettingsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    description: String,
    outgoingServerSettings: {
      host: String,
      password: String,
      port: Number,
      secure: Boolean,
      username: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
EmailSettingsSchema.virtual('business').get(function(): VirtualType {
  return this._id;
});
