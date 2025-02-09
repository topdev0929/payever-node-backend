import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const FormFieldValueSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    name: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: String,
    },
  },
);
