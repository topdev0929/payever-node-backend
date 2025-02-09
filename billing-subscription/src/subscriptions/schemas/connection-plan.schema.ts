import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business';
import { ConnectionSchemaName } from '../../integrations/schemas/connection.schema';
import { SubscriptionPlanSchemaName } from './subscription-plan.schema';

export const ConnectionPlanSchemaName: string = 'ConnectionPlan';

export const ConnectionPlanSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: true },
    connection: { type: String, required: true, ref: ConnectionSchemaName },
    subscriptionPlan: { type: String, ref: SubscriptionPlanSchemaName },
  },
  {
    collection: 'plans',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ connection: 1 })
  .index({ _id: 1, businessId: 1 })
  .index({ businessId: 1, subscriptionPlan: 1 })
  .index({ connection: 1, subscriptionPlan: 1 })
  ;

ConnectionPlanSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
