import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ContactDetailsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    firstName: String,
    lastName: String,
    phone: String,
  },
);
