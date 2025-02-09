import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ActionApiCallSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },

    paymentId: {
      required: false,
      type: String,
    },

    businessId: {
      required: false,
      type: String,
    },

    action: {
      required: false,
      type: String,
    },

    status: {
      required: false,
      type: String,
    },

    error: {
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
