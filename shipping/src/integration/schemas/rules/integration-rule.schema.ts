import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CommissionTypesEnum } from '../../enums';
import { RuleRangeSchema } from './rule-range.schema';

export const IntegrationRuleSchemaName: string = 'IntegrationRule';
export const IntegrationRuleSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    commission: {
      type: Schema.Types.Number,
    },
    commissionType: { type: CommissionTypesEnum },
    flatRate: {
      type: Schema.Types.Number,
    },
    freeOver: {
      type: Schema.Types.Number,
    },
    isActive: {
      default: true,
      type: Schema.Types.Boolean,
    },
    rateRanges: {
      type: [RuleRangeSchema],
    },
    weightRanges: {
      type: [RuleRangeSchema],
    },
  },
  {
    timestamps: { },
  },
);
