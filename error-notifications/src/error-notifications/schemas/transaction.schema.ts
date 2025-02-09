import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const TransactionSchemaName: string = 'Transaction';
export const TransactionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    originalId: {
      required: true,
      type: String,
    },
    paymentType: {
      required: true,
      type: String,
    },
    status: {
      required: true,
      type: String,
    },
    updatedAt: {
      required: true,
      type: Date,
    },
  },
)
  .index({ businessId: 1, paymentType: 1 })
  .index({ updatedAt: 1 })
;
