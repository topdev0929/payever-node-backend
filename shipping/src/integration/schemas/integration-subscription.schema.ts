import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { IntegrationSchemaName } from './integration.schema';
import { IntegrationRuleSchemaName } from './rules';

export const IntegrationSubscriptionSchemaName: string = 'IntegrationSubscription';
export const IntegrationSubscriptionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    enabled: {
      type: Schema.Types.Boolean,
    },
    installed: {
      type: Schema.Types.Boolean,
    },
    integration: {
      ref: IntegrationSchemaName,
      required: true,
      type: Schema.Types.String,
    },
    rules: [{
      default: [],
      ref: IntegrationRuleSchemaName,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
  },
);
