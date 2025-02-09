import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },

    enabled: Boolean,
    hasMessageApp: Boolean,
    name: String,
  },
  {
    timestamps: { },
  },
);

BusinessSchema.index({ enabled: 1 });
