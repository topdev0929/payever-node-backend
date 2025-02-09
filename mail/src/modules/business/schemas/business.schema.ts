import { ChannelAwareBusinessPlugin } from '@pe/channels-sdk';
import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    campaigns: [{ type: Schema.Types.String, required: true, ref: 'Campaign' }],
    name: { type: String },
  },
  {
    timestamps: { },
  },
);

BusinessSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});

BusinessSchema.plugin(ChannelAwareBusinessPlugin, { });
