import { Schema } from 'mongoose';

export const ApiCallSellerSchema: Schema = new Schema(
  {
    id: { type: String, required: false },

    email: { type: String, required: false },
    first_name:  { type: String, required: false },
    last_name:  { type: String, required: false },
  },
  {
    _id: false,
  },
);
