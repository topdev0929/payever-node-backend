import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SubscriptionSchemaName: string = 'Subscription';

export const SubscriptionSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  businessId: { type: String, required: true },
  subscribed: { type: Boolean, default: true },
});
