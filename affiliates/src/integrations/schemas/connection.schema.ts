import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';
import { IntegrationSchemaName } from './integration.schema';

export const ConnectionSchemaName: string = 'Connection';

export const ConnectionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: true },
    integration: { type: String, ref: IntegrationSchemaName, required: true },
    integrationName: String,
    isEnabled: Boolean,
  },
  {
    collection: 'connections',
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ businessId: 1, integrationName: 1 })
  .index({ businessId: 1, isEnabled: 1 });

ConnectionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
