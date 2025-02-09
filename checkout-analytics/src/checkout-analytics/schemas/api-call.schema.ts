import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ApiCallSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },

    paymentId: {
      required: false,
      type: String,
    },

    paymentMethod: {
      required: false,
      type: String,
    },

    businessId: {
      required: false,
      type: String,
    },

    channel: {
      required: false,
      type: String,
    },

    channelSetId: {
      required: false,
      type: String,
    },

    amount: {
      required: false,
      type: Number,
    },

    currency: {
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

    updatedAt: {
      default: Date.now(),
      required: false,
      type: Date,
    },
  },
);
