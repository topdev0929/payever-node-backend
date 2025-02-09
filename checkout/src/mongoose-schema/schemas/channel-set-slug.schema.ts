import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ChannelSetSlugSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    lastUse: { type: Schema.Types.Date, default: null },
    slug: { type: Schema.Types.String, unique: true },
    used: { type: Schema.Types.Number, default: 0 },
  },
  {
    timestamps: { },
  },
);
