import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
  },
  {
    timestamps: { },
  },
);
