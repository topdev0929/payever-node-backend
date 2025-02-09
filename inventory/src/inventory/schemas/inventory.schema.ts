import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName, InventoryLocationSchemaName } from '../../environments/mongoose-schema.names';
import { OriginalInventorySchema } from './original-inventory.schema';

export const InventorySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    
    businessId: { type: Schema.Types.String, required: true },
    product: { type: String },
    sku: { type: String, required: true },

    barcode: String,
    reserved: Number,
    stock: Number,

    emailLowStock: { type: Boolean, default: false },
    lowStock: Number,

    inventoryLocations: [{ type: Schema.Types.String, ref: InventoryLocationSchemaName }],

    isNegativeStockAllowed: { type: Boolean, default: false },
    isTrackable: { type: Boolean, default: true },

    origin: String,
    originalInventory: { type: OriginalInventorySchema },

    requireShipping: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

  .index({ businessId: 1 })
  .index({ sku: 1 })
  .index({ product: 1 })
  .index({ businessId: 1, sku: 1 }, { unique: true });

InventorySchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
