import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CheckoutSchemaName } from '../schema-names';

export const ChannelSetSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    active: { type: Schema.Types.Boolean },
    checkout: { type: Schema.Types.String, ref: CheckoutSchemaName },
    customPolicy: { type: Schema.Types.Boolean },
    enabledByDefault: { type: Schema.Types.Boolean },
    name: { type: Schema.Types.String },
    originalId: { type: Schema.Types.String },
    policyEnabled: { type: Schema.Types.Boolean, default: true },
    subType: { type: Schema.Types.String },
    type: { type: Schema.Types.String },
  },
  {
    timestamps: {

    },
  },
)
  .index({ checkout: 1, type: 1 })
  .index({ originalId: 1 }, { unique: true, sparse: true })
  .index({ name: 'text' });
