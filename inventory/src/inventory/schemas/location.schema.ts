import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';


export const LocationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    city: {
      required: true,
      type: Schema.Types.String,
    },
    countryCode: {
      required: true,
      type: Schema.Types.String,
    },
    name: {
      required: true,
      type: Schema.Types.String,
    },
    stateProvinceCode: {
      type: Schema.Types.String,
    },
    streetName: {
      required: true,
      type: Schema.Types.String,
    },
    streetNumber: {
      type: Schema.Types.String,
    },
    zipCode: {
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
