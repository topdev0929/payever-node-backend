import { Schema } from 'mongoose';
import { extendSchema } from '../../helpers';
import { CommonTransactionHistorySchema } from './common-transaction-history.schema';
import { PaymentActionsEnum } from '../../enum';
import { RefundItemInterface } from '../../interfaces/action-payload';

export const CancelHistorySchemaName: string = 'HistoryCancel';
export const CancelHistorySchema: Schema = extendSchema(
  CommonTransactionHistorySchema,
  {
    action: { default: PaymentActionsEnum.Cancel, type: String },
  },
  {
    collection: 'history-cancel',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

CancelHistorySchema.index({ transaction_id: 1 });

// BC with old field
CancelHistorySchema.virtual('refund_items').get(function (): RefundItemInterface[] {
  return this.items || [];
});
