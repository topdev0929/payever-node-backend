import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ShopSystemSchemaName: string = 'ShopSystem';

export const ShopSystemSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    apiKeys: { type: [String] },
    channel: { type: Schema.Types.String, required: true, ref: 'Channel' },
    channelSet: { type: Schema.Types.String, required: true, ref: 'ChannelSet' },
  },
  {
    timestamps: { },
  },
)
  .index({ channelSet: 1 });
