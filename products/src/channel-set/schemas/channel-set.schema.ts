import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from '../../business/schemas';

export const ChannelSetSchemaName: string = 'ChannelSet';
export const ChannelSetSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    active: { type: Schema.Types.Boolean },
    businessId: { type: Schema.Types.String },
    customPolicy: { type: Schema.Types.Boolean },
    enabledByDefault: { type: Schema.Types.Boolean },
    name: { type: Schema.Types.String },
    originalId: { type: Schema.Types.String },
    policyEnabled: { type: Schema.Types.Boolean, default: true },
    type: { type: Schema.Types.String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

  .index({ originalId: 1 }, { unique: true, sparse: true })
  .index({ businessId: 1 })
  .index({ businessId: 1, type: 1 })
  ;

// For backwards compatibility
ChannelSetSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
}).get(function (): string {
  return this.businessId;
});
