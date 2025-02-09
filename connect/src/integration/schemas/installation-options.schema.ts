import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { LinkSchema } from './link.schema';

export const InstallationOptionsSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  appSupport: String,
  category: String,
  countryList: [String],
  description: String,
  developer: String,
  developerTranslations: Schema.Types.Mixed,
  languages: String,
  links: [LinkSchema],
  optionIcon: String,
  price: String,
  pricingLink: String,
  website: String,
  wrapperType: String,
});
