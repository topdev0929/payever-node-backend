import { Schema } from 'mongoose';

export const CheckoutFooterUrlsSchema: Schema = new Schema(
  {
    disclaimer: String,
    logo: String,
    privacy: String,
    support: String,
  },
  {
    _id: false,
  },
);
