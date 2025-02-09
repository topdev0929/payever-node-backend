import { Schema } from 'mongoose';
import { TransactionCartItemInterface, TransactionRefundItemInterface } from '../interfaces';
import { AddressSchema } from './address.schema';
import { TransactionCartItemSchema } from './transaction-cart-item-schema';
import { CommonTransactionHistorySchema } from './history/common-transaction-history.schema';
import { HistoryApiCallStatusEnum, PaymentActionsEnum } from '../enum';
import { v4 as uuid } from 'uuid';

export const TransactionSchemaName: string = 'Transaction';

export const TransactionSchema: Schema = new Schema(
{
  _id: { type: String, default: uuid },
  /** Original id for legacy purposes */
  original_id: { type: String, unique: true },
  uuid: { type: String, required: true, unique: true },

  api_call_id: { type: String, required: false },

  action_running: { type: Boolean, required: false, default: false },
  amount: Number,
  billing_address: AddressSchema,
  business_option_id: Number,
  business_uuid: { type: String },

  channel: String,
  channel_set_id: String,
  /** @deprecated */
  channel_set_uuid: String,
  channel_source: String,
  channel_type: String,
  channel_uuid: String,

  customer_email: { type: String },
  customer_name: { type: String, required: true },
  customer_type: { type: String, required: false },

  is_shipping_order_processed: Boolean,
  shipping_address: { type: AddressSchema },
  shipping_category: String,
  shipping_method_name: String,
  shipping_option_name: String,
  shipping_order_id: String,
  specific_status: String,

  created_at: { type: Date, required: true },
  currency: { type: String, required: true },
  delivery_fee: Number,
  down_payment: Number,
  fee_accepted: Boolean,
  history: [CommonTransactionHistorySchema],
  historyIds: [{ type: String, default: [] }],
  invoice_id: String,

  captured_items: [TransactionCartItemSchema],
  items: [TransactionCartItemSchema],
  refunded_items: [TransactionCartItemSchema],

  merchant_email: String,
  merchant_name: String,
  /** Serialized big object */
  payment_details: String,
  payment_fee: Number,
  payment_flow_id: String,
  place: String,
  plugin_version: String,
  reference: String,
  santander_applications: [String],

  payment_issuer: { type: String, required: false },
  pos_merchant_mode: { type: Boolean, required: false },
  pos_verify_type: { type: Number, required: false },
  status: { type: String, required: true },
  status_color: { type: String },
  store_id: String,
  store_name: String,
  total: { type: Number, required: true },
  type: { type: String, required: true },
  updated_at: Date,
  user_uuid: String,

  seller_email: { type: String, required: false },
  seller_id: { type: String, required: false },
  seller_name: { type: String, required: false },

  example: Boolean,
  example_shipping_label: String,
  example_shipping_slip: String,

  order_id: { type: String, required: false },

  anonymized: { type: Boolean, default: false},
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

TransactionSchema.index({ santander_applications: 1 });
TransactionSchema.index({ reference: 1 });
TransactionSchema.index({ customer_name: 1 });
TransactionSchema.index({ customer_email: 1 });
TransactionSchema.index({ merchant_name: 1 });
TransactionSchema.index({ merchant_email: 1 });
TransactionSchema.index({ status: 1, _id: 1 });
TransactionSchema.index({ business_uuid: 1 });
TransactionSchema.index({ example: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ created_at: -1 });
TransactionSchema.index({ created_at: 1 });
TransactionSchema.index({ business_uuid: 1, example: 1 });

TransactionSchema.virtual('amount_refunded').get(function (): number {
  let totalRefunded: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.Refund || entry.action === PaymentActionsEnum.Return)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { amount: number}) => totalRefunded += (entry.amount || 0));
  }

  return Math.round((totalRefunded + Number.EPSILON) * 100) / 100;
});

TransactionSchema.virtual('delivery_fee_refunded').get(function (): number {
  let totalRefunded: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.Refund || entry.action === PaymentActionsEnum.Return)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { delivery_fee: number }) => totalRefunded += (entry.delivery_fee || 0));
  }

  return Math.round((totalRefunded + Number.EPSILON) * 100) / 100;
});

TransactionSchema.virtual('amount_captured').get(function (): number {
  let totalCaptured: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.ShippingGoods)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { amount: number }) => totalCaptured += (entry.amount || 0))
      ;
  }

  return Math.round((totalCaptured + Number.EPSILON) * 100) / 100;
});

TransactionSchema.virtual('delivery_fee_captured').get(function (): number {
  let totalCaptured: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.ShippingGoods)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { delivery_fee: number }) => totalCaptured += (entry.delivery_fee || 0))
    ;
  }

  return Math.round((totalCaptured + Number.EPSILON) * 100) / 100;
});

TransactionSchema.virtual('amount_canceled').get(function (): number {
  let totalCanceled: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.Cancel)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { amount: number }) => totalCanceled += (entry.amount || 0))
    ;
  }

  return Math.round((totalCanceled + Number.EPSILON) * 100) / 100;
});

TransactionSchema.virtual('amount_invoiced').get(function (): number {
  let totalInvoiced: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.Invoice)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { amount: number }) => totalInvoiced += (entry.amount || 0))
    ;
  }

  return Math.round((totalInvoiced + Number.EPSILON) * 100) / 100;
});

TransactionSchema.virtual('delivery_fee_canceled').get(function (): number {
  let totalCanceled: number = 0;

  if (this.history) {
    this.history
      .filter((entry: { action: string; status: HistoryApiCallStatusEnum }) =>
        (entry.action === PaymentActionsEnum.Cancel)
        &&
        (!entry.status || entry.status === HistoryApiCallStatusEnum.success),
      )
      .forEach((entry: { delivery_fee: number }) => totalCanceled += (entry.delivery_fee || 0))
    ;
  }

  return Math.round((totalCanceled + Number.EPSILON) * 100) / 100;
});

/**
 * @deprecated use amount_left instead of amount_refund_rest
 */
TransactionSchema.virtual('amount_refund_rest').get(function (): number {
  const amount: number = Math.round((this.amount - this.amount_refunded + Number.EPSILON) * 100) / 100;

  return amount >= 0 ? amount : 0;
});

TransactionSchema.virtual('amount_refund_rest_with_partial_capture').get(function (): number {
  const amountCaptureRest: number =
    Math.round((this.amount_captured - this.amount_refunded + Number.EPSILON) * 100) / 100;

  return amountCaptureRest >= 0 ? amountCaptureRest : 0;
});

TransactionSchema.virtual('amount_capture_rest').get(function (): number {
  const amountCaptureRest: number =
    Math.round((this.total - this.amount_captured - this.amount_refunded + Number.EPSILON) * 100) / 100;

  return amountCaptureRest >= 0 ? amountCaptureRest : 0;
});

TransactionSchema.virtual('amount_capture_rest_with_partial_cancel').get(function (): number {
  const amountCaptureRestWithPartialCancel: number =
    Math.round((this.total - this.amount_captured - this.amount_canceled + Number.EPSILON) * 100) / 100;

  return amountCaptureRestWithPartialCancel >= 0 ? amountCaptureRestWithPartialCancel : 0;
});

TransactionSchema.virtual('amount_cancel_rest').get(function (): number {
  const amountCancelRest: number =
    Math.round((this.total - this.amount_captured - this.amount_canceled + Number.EPSILON) * 100) / 100;

  return amountCancelRest >= 0 ? amountCancelRest : 0;
});

TransactionSchema.virtual('amount_invoice_rest').get(function (): number {
  const amountInvoiceRest: number =
    Math.round((this.total - this.amount_invoiced - this.amount_refunded + Number.EPSILON) * 100) / 100;

  return amountInvoiceRest >= 0 ? amountInvoiceRest : 0;
});

TransactionSchema.virtual('available_refund_items').get(function (): TransactionRefundItemInterface[] {
  const refundItems: TransactionRefundItemInterface[] = [];

  this.items.forEach((item: TransactionCartItemInterface) => {
    let availableCount: number = item.quantity;

    if (this.refunded_items) {
      const existingRefundItem: TransactionCartItemInterface = this.refunded_items.find(
        (refundedItem: TransactionCartItemInterface) => item.identifier === refundedItem.identifier,
      );

      if (existingRefundItem && existingRefundItem.quantity) {
        availableCount -= existingRefundItem.quantity;
      }
    }

    if (availableCount > 0) {
      refundItems.push({
        count: availableCount,
        identifier: item.identifier,
        item_uuid: item.uuid,
      });
    }
  });

  return refundItems;
});

TransactionSchema.virtual('amount_left').get(function (): number {
  if (this.status === 'STATUS_CANCELLED') {
    return this.amount;
  } else {
    const amount: number =
      Math.round(
        (
          this.amount
          - this.amount_refunded
          - this.amount_canceled
          + this.delivery_fee_refunded
          + this.payment_fee
          + Number.EPSILON
        )
        * 100) / 100;

    return amount >= 0 ? amount : 0;
  }
});

TransactionSchema.virtual('delivery_fee_left').get(function (): number {
  if (this.status === 'STATUS_CANCELLED') {
    return 0;
  } else {
    const amount: number =  Math.round((this.delivery_fee - this.delivery_fee_refunded + Number.EPSILON) * 100) / 100;

    return amount >= 0 ? amount : 0;
  }
});

TransactionSchema.virtual('total_left').get(function (): number {
  if (this.status === 'STATUS_CANCELLED') {
    return this.total;
  } else {
    const totalLeft: number =
      Math.round((this.total - this.amount_refunded - this.amount_canceled + Number.EPSILON) * 100) / 100;

    return totalLeft >= 0 ? totalLeft : 0;
  }
});
