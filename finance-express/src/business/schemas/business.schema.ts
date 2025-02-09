import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ChannelAwareBusinessPlugin } from '@pe/channels-sdk';

export const BusinessSchemaName: string = 'Business';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: String,
  },
  {
    timestamps: { },
  },
);

BusinessSchema.plugin(ChannelAwareBusinessPlugin, { });
