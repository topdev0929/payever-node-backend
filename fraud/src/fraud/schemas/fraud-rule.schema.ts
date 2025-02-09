import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { RuleConditionSchema } from './rule-condition.schema';
import { RuleActionSchema } from './rule-action.schema';

export const FraudRuleSchemaName: string = 'FraudRule';
export const FraudRuleSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    actions: [RuleActionSchema],
    businessId: {
      required: true,
      type: String,
    },
    conditions: [RuleConditionSchema],
    description: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  }
);

FraudRuleSchema.index({ businessId: 1 });
FraudRuleSchema.index({ businessId: 1 });
