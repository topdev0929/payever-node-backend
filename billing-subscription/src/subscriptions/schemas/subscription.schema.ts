import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ConnectionPlanSchemaName } from './connection-plan.schema';

export const SubscriptionSchemaName: string = 'Subscription';

export const SubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    city: String,
    company: String,
    country: String,
    customerEmail: String,
    customerName: String,
    group: String,
    plan: { type: String, ref: ConnectionPlanSchemaName },
    quantity: Number,
    reference: { type: String, required: true },
    remoteSubscriptionId: String,
    transactionUuid: String,
    trialEnd: Date,
    userId: { type: String, required: true },
  },
  {
    collection: 'subscriptions',
    timestamps: { createdAt: true, updatedAt: false },
  },
)
  .index({ plan: 1 })
  .index({ remoteSubscriptionId: 1, plan: 1 })
  ;
