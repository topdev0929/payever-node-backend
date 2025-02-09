import { Schema } from 'mongoose';

export const OrderCustomerSchema: Schema = new Schema(
  {
    birthdate: { type: Date, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
  },
  {
    _id: false,
  },
);
