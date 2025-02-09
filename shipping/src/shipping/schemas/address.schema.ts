import { Schema } from 'mongoose';

export const AddressSchema: Schema = new Schema(
  {
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
    phone: {
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
);
