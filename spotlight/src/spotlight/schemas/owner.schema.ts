import { Schema } from 'mongoose';

export const OwnerSchema: Schema = new Schema(
  {
    email: String,
    fullName: String,
    userId: String,
  },
);
