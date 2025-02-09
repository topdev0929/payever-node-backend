import { Schema } from 'mongoose';
import { TransactionMailEventSchema } from '../transaction-mail-event.schema';
import { TransactionHistoryUserSchema } from './transaction-history-user.schema';
import { v4 as uuid } from 'uuid';
import { TransactionCartItemSchema } from '../transaction-cart-item-schema';
import { RefundItemInterface } from '../../interfaces/action-payload';

export const CommonTransactionHistorySchemaName: string = 'HistoryCommon';
export const CommonTransactionHistorySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    action: String,
    amount: Number,
    currency: String,
    delivery_fee: Number,
    params: Schema.Types.Mixed,
    payment_status: String,
    psp_status: String,
    reason: String,
    reference: String,
    requirements_state: String,

    mail_event: TransactionMailEventSchema,

    items: [TransactionCartItemSchema],

    business_id: { type: String, required: false },
    transaction_id: { type: String, required: false, ref: 'Transaction' },

    idempotency_key: { type: String, required: false },
    is_external_api_call: { type: Boolean, required: false },
    request_data: { type: Schema.Types.Mixed, required: false },
    status: { type: String, required: false },

    error: { type: String, required: false },
    execution_time: { type: String, required: false },

    user: TransactionHistoryUserSchema,
  },
  {
    collection: 'history-common',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

CommonTransactionHistorySchema.index({ transaction_id: 1 });

// BC with old field
CommonTransactionHistorySchema.virtual('refund_items').get(function (): RefundItemInterface[] {
  return this.items || [];
});
