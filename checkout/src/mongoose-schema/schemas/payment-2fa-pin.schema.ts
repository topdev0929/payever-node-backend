import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const Payment2faPinSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  paymentId: { type: String, required: true },
  pin: { type: Number, required: true },
  verified: { type: Boolean, default: false },
})
  .index({ payment: 1, verified: 1 })
  .index({ payment: 1, pin: 1, verified: 1 });
