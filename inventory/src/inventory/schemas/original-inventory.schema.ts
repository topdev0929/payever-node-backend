import { Schema } from 'mongoose';

import { BusinessSchemaName } from '../../environments/mongoose-schema.names';

export const OriginalInventorySchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.String, required: true },
    sku: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

  .index({ businessId: 1, sku: 1 });

OriginalInventorySchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
