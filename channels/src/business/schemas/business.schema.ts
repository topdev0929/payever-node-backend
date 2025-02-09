import { ChannelAwareBusinessPlugin } from '@pe/channels-sdk';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BusinessSchemaName: string = 'Business';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
  },
  {
    timestamps: { },
  },
);

BusinessSchema.plugin(ChannelAwareBusinessPlugin, { });
