import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SubscriptionPlanSchemaName } from './subscription-plan.schema';

export const SubscriptionPlansGroupSchemaName: string = 'PlansGroup';
export const SubscriptionPlansGroupSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  name: { type: String, required: true },
  plans: {
    ref: SubscriptionPlanSchemaName,
    required: true,
    type: Array,
  },
});
