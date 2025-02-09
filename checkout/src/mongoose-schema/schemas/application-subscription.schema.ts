import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ApplicationSchemaName } from '../schema-names';

export const ApplicationSubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    application: { type: String, required: true, ref: ApplicationSchemaName },
    enabled: Boolean,
    installed: { type: Boolean, default: false },
    options: Schema.Types.Mixed,
  },
  {
    timestamps: { },
  },
);
