import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { LocationSchemaName } from '../../environments/mongoose-schema.names';

export const InventoryLocationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    inventoryId: { type: String },
    locationId: { type: String },
    stock: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

InventoryLocationSchema.virtual('location', {
  foreignField: '_id',
  justOne: true,
  localField: 'locationId',
  ref: LocationSchemaName,
});
