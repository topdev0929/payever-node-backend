import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SubscriptionGroupSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    common: {
      default: false,
      type: Boolean,
    },
    name: {
      required: true,
      type: String,
      unique: true,
    },
    subscriptions: [{ type: Schema.Types.String }],
  },
  {
    timestamps: { },
  },
)
  .index({ common: 1 })
  ;
