import { Schema } from 'mongoose';
import { PaymentAddressSchema } from './payment-address.schema';
import { PaymentShippingOptionSchema } from './payment-shipping-option.schema';
import { PaymentItemSchema } from './payment-item.schema';

export const PaymentSchema: Schema = new Schema({
  uuid: {
    required: true,
    type: String,
    unique: true,
  },

  amount: {
    required: true,
    type: Number,
  },
  api_call_id: {
    required: false,
    type: String,
  },
  billing_address: {
    required: true,
    type: PaymentAddressSchema,
  },
  business_option_id: {
    required: true,
    type: String,
  },
  business_uuid: {
    required: true,
    type: String,
  },
  channel: {
    required: true,
    type: String,
  },
  channel_set_id: {
    required: false,
    type: String,
  },
  /** @deprecated */
  channel_set_uuid: {
    required: false,
    type: String,
  },
  channel_source: {
    required: false,
    type: String,
  },
  channel_type: {
    required: false,
    type: String,
  },
  color_state: {
    required: false,
    type: String,
  },
  currency: {
    required: true,
    type: String,
  },
  customer_email: {
    required: true,
    type: String,
  },
  customer_name: {
    required: false,
    type: String,
  },
  customer_type: {
    required: false,
    type: String,
  },
  delivery_fee: {
    required: true,
    type: Number,
  },
  down_payment: {
    required: true,
    type: Number,
  },
  items: {
    default: [],
    required: false,
    type: [PaymentItemSchema],
  },
  merchant_name: {
    required: true,
    type: String,
  },
  original_id: {
    required: true,
    type: String,
    unique: true,
  },
  payment_details: {
    required: false,
    type: Schema.Types.Mixed,
  },
  payment_fee: {
    required: true,
    type: Number,
  },
  payment_issuer: {
    required: false,
    type: String,
  },
  payment_type: {
    required: true,
    type: String,
  },
  reference: {
    required: true,
    type: String,
  },
  shipping_address: {
    required: false,
    type: PaymentAddressSchema,
  },
  shipping_category: {
    required: false,
    type: String,
  },
  shipping_method_name: {
    required: false,
    type: String,
  },
  shipping_option: {
    required: false,
    type: PaymentShippingOptionSchema,
  },
  shipping_option_name: {
    required: false,
    type: String,
  },
  specific_status: {
    required: false,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  total: {
    required: true,
    type: Number,
  },

  created_at: {
    required: true,
    type: Date,
  },
  updated_at: {
    required: false,
    type: Date,
  },
})
  .index({ created_at: -1 })
  .index({ business_uuid: 1 });
