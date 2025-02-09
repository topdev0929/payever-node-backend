import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName, InventorySchemaName } from '../../environments/mongoose-schema.names';

export const ReservationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    inventory: { type: Schema.Types.String, required: true, ref: InventorySchemaName },
    quantity: { type: Number, required: true },
    // creation: {
    //   type: Date,
    //   required: true,
    // },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ReservationSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
