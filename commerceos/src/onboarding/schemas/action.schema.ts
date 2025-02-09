import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ActionSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    integration: {
      type: Schema.Types.Mixed,
    },
    method: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    payload: {
      type: Schema.Types.Mixed,
    },
    priority: {
      required: false,
      type: Number,
    },
    registerSteps: {
      type: [String],
    },
    url: {
      required: true,
      type: String,
    },
  },
);
