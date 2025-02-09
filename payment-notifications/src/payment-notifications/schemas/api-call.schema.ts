import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ApiCallSchemaName: string = 'ApiCall';
export const ApiCallSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    cancelUrl: {
      required: false,
      type: String,
    },
    customerRedirectUrl: {
      required: false,
      type: String,
    },
    failureUrl: {
      required: false,
      type: String,
    },
    noticeUrl: {
      required: false,
      type: String,
    },
    pendingUrl: {
      required: false,
      type: String,
    },
    successUrl: {
      required: false,
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

    clientId: {
      required: false,
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
