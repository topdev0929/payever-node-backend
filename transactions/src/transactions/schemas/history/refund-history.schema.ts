import { Schema } from 'mongoose';
import { extendSchema } from '../../helpers';
import { CommonTransactionHistorySchema } from './common-transaction-history.schema';
import { PaymentActionsEnum } from '../../enum';
import { RefundItemInterface } from '../../interfaces/action-payload';

export const RefundHistorySchemaName: string = 'HistoryRefund';
export const RefundHistorySchema: Schema = extendSchema(
  CommonTransactionHistorySchema,
  {
    action: { default: PaymentActionsEnum.Refund, type: String },
  },
  {
    collection: 'history-refund',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

RefundHistorySchema.index({ transaction_id: 1 });

// BC with old field
RefundHistorySchema.virtual('refund_items').get(function (): RefundItemInterface[] {
  return this.items || [];
});
