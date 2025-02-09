import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const OAuthTokenSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },

    businessIds: {
      required: false,
      type: [String],
    },

    clientId: {
      required: false,
      type: String,
    },

    executionTime: {
      required: false,
      type: Number,
    },

    createdAt: {
      default: Date.now(),
      required: false,
      type: Date,
    },
  },
);
