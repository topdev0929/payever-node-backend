import { Schema } from 'mongoose';
import { extendSchema } from '../../helpers';
import { CommonTransactionHistorySchema } from './common-transaction-history.schema';
import { PaymentActionsEnum } from '../../enum';
import { RefundItemInterface } from '../../interfaces/action-payload';

export const ShippingGoodsHistorySchemaName: string = 'HistoryShippingGoods';
export const ShippingGoodsHistorySchema: Schema = extendSchema(
  CommonTransactionHistorySchema,
  {
    action: { default: PaymentActionsEnum.ShippingGoods, type: String },
  },
  {
    collection: 'history-shipping-goods',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

ShippingGoodsHistorySchema.index({ transaction_id: 1 });

// BC with old field
ShippingGoodsHistorySchema.virtual('refund_items').get(function (): RefundItemInterface[] {
  return this.items || [];
});
