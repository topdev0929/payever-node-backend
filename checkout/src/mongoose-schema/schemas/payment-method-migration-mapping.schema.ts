import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PaymentMethodMigrationMappingSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: false, default: null },
    enabled: { type: Boolean, required: false, default: true },
    paymentMethodFrom: { type: String, required: true },
    paymentMethodTo: { type: String, required: true },
  },
  {
    timestamps: { },
  },
);
