import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { IntegrationSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const IntegrationSubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    integration: { type: Schema.Types.String, required: true, ref: IntegrationSchemaName },

    installed: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: { },
  },
);
