import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName, IntegrationSchemaName } from '../schema-names';

export const BusinessIntegrationSubSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    integration: { type: Schema.Types.String, required: true, ref: IntegrationSchemaName },

    enabled: Schema.Types.Boolean,
    installed: { type: Schema.Types.Boolean, default: false },
    options: Schema.Types.Mixed,
  },
  {
    timestamps: {

    },
    toJSON: { depopulate: true, virtuals: true },
    toObject: { depopulate: true, virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ _id: 1, installed: 1 })
  .index({ integration: 1, businessId: 1 });

BusinessIntegrationSubSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
