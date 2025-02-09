import { Schema } from 'mongoose';

export const MemberSchema: Schema = new Schema(
  {
    role: String,
    user: String,
  },
  {
    _id: false,
  },
);
