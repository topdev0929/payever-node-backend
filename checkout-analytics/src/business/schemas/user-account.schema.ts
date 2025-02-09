import { Schema } from 'mongoose';

export const UserAccountSchema: Schema = new Schema(
  {
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    logo: { type: String },
    phone: { type: String },
  },
  { _id: false, timestamps: false },
);
