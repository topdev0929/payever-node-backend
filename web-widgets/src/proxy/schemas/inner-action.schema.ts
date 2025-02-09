import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const InnerActionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    description: {
      default: '',
      required: false,
      type: String,
    },
    isClientAllowed: {
      default: false,
      required: false,
      type: Boolean,
    },
    method: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
      unique: true,
    },
    roles: {
      default: [],
      required: false,
      type: [String],
    },
    url: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);
