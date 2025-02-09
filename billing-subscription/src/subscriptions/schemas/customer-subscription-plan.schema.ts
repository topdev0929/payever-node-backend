import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PlanCustomerSchemaName } from './customer-plan.schema';
import { ConnectionPlanSchemaName } from './connection-plan.schema';
import { SubscribersGroupSchemaName } from './subscribers-group.schema';

export const PlanCustomerSubscriptionSchemaName: string = 'CustomerPlanSubscription';

export const PlanCustomerSubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    customer: { type: String, ref: PlanCustomerSchemaName },
    plan: { type: String, ref: ConnectionPlanSchemaName },
    quantity: Number,
    reference: { type: String, required: true },
    subscribersGroups: [{ type: String, ref: SubscribersGroupSchemaName }],
    transactionId: String,
    trialEnd: Date,
  }, 
  {
    timestamps: { createdAt: true, updatedAt: false },
  });
