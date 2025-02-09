import { Schema } from 'mongoose';

export const CheckoutCallbacksSchema: Schema = new Schema({
  cancelUrl: { type: String },
  customerRedirectUrl: { type: String },
  failureUrl: { type: String },
  noticeUrl: { type: String },
  pendingUrl: { type: String },
  successUrl: { type: String },
});
