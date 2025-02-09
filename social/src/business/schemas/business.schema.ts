import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { IntegrationSubscriptionSchemaName } from '../../integration/schemas';

export const BusinessSchemaName: string = 'BusinessLocal';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    currency: { type: String, default: 'EUR' },
    integrationSubscriptions: [{
      index: true,
      ref: IntegrationSubscriptionSchemaName,
      type: Schema.Types.String,
    }],
  },
  {
    collection: 'businesses',
    timestamps: { },
  },
);
