import { Schema } from 'mongoose';

import { FormStatusEnum } from '../enums';

export const CheckoutFormSchema: Schema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    status: {
      enum: Object.values(FormStatusEnum),
      required: true,
      type: String,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);
