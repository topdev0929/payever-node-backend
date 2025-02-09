import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const InstallationOptionsSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  appSupport: String,
  category: String,
  countryList: [String],
  description: String,
  developer: String,
  languages: String,
  optionIcon: String,
  price: String,
  pricingLink: String,
  website: String,
});
