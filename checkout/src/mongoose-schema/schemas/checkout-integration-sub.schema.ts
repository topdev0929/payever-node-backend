import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CheckoutSchemaName, IntegrationSchemaName } from '../schema-names';

export const CheckoutIntegrationSubSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    checkout: { type: Schema.Types.String, required: true, ref: CheckoutSchemaName },
    integration: { type: Schema.Types.String, required: true, ref: IntegrationSchemaName },

    installed: { type: Schema.Types.Boolean, default: false },
    options: Schema.Types.Mixed,
  },
  {
    timestamps: {

    },
    toJSON: { depopulate: true },
    toObject: { depopulate: true },
  },
)
  .index({ checkout: 1 })
  .index({ checkout: 1, integration: 1 });
