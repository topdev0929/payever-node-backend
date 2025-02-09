import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SubscriptionSchemaName: string = 'Subsciption';
export const SubscriptionSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    businessId: String,
    connected: { type: Boolean, default: false },
    installed: { type: Boolean, default: false },
    name: String,
  },
  {
    timestamps: true,
  },
);
