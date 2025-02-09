import { Schema } from 'mongoose';

export const ApiCallCompanySchema: Schema = new Schema(
  {
    external_id: String,
    homepage: String,
    name: String,
    registration_location: String,
    registration_number: String,
    tax_id: String,
    type: String,
  },
  {
    _id: false,
  },
);
