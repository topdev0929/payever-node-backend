import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ActionApiCallSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    action: { type: String, required: true },
    businessId: { type: String, required: true },
    paymentId: { type: String, required: true },

    requestData: { type: Schema.Types.Mixed, required: false },
    status: { type: String, required: true },

    error: { type: String, required: false },

    executionTime: { type: String, required: false },
  },
  {
    timestamps: { },
  },
);
