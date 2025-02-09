import { Schema } from 'mongoose';
import { BusinessSchemaName } from '@pe/business-kit';
import { v4 as uuid } from 'uuid';

export const AppointmentNetworkSchemaName: string = 'AppointmentNetwork';
export const AppointmentNetworkSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    business: { index: true, ref: BusinessSchemaName, required: true, type: String },
    favicon: String,
    isDefault: { type: Boolean, default: false },
    logo: String,
    name: String,
  },
  {
    timestamps: { },
  },
);
