import { Schema } from 'mongoose';

export const ProductSettingsSchema: Schema = new Schema({
  businessIds: [String],
  settings: {
    currency: String,
    measureMass: {
      default: 'kg',
      type: String,
    },
    measureSize: {
      default: 'cm',
      type: String,
    },
    welcomeShown: {
      default: false,
      type: Boolean,
    },
  },
});

// For backwards compatibility
ProductSettingsSchema.virtual('businessUuid').get(function (): string {
  return this.businessIds;
});
