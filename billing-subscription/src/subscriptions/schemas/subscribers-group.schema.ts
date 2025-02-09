import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PlanCustomerSchemaName } from './customer-plan.schema';

export const SubscribersGroupSchemaName: string = 'SubscribersGroup';
export const SubscribersGroupSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  name: { type: String, required: true },
  subscribers: [{
    ref: PlanCustomerSchemaName,
    required: true,
    type: String,
  }],
});
