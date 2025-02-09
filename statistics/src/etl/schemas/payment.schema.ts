/* tslint:disable:object-literal-sort-keys */
import { Schema } from 'mongoose';
import { BrowserEnum, DeviceEnum } from '../../statistics';
import { v4 as uuid } from 'uuid';
import { PaymentAddressSchema } from './payment-address.schema';
import { PaymentItemSchema } from './payment-item-schema';

export const PaymentSchemaName: string = 'Payment';
export const PaymentSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  amount: {
    required: true,
    type: Number,
  },
  deliveryFee: {
    required: false,
    type: Number,
  },
  downPayment: {
    required: false,
    type: Number,
  },
  total: {
    required: true,
    type: Number,
  },
  businessId: {
    required: false,
    type: String,
  },
  businessName: {
    required: false,
    type: String,
  },
  businessCreatedAt: {
    type: Date,
    index: true,
  },
  browser: {
    default: null,
    required: false,
    type: BrowserEnum,
  },
  channel: {
    required: true,
    type: String,
  },
  channelSetId: {
    required: false,
    type: String,
  },
  currency: {
    required: true,
    type: String,
  },
  device: {
    default: null,
    required: false,
    type: DeviceEnum,
  },
  originalId: {
    required: true,
    type: String,
    unique: true,
  },
  paymentMethod: {
    required: true,
    type: String,
  },
  reference: {
    required: true,
    type: String,
  },
  specificStatus: {
    required: false,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  billingAddress: {
    required: false,
    type: PaymentAddressSchema,
  },
  shippingAddress: {
    required: false,
    type: PaymentAddressSchema,
  },
  customerName: {
    required: false,
    type: String,
  },
  customerEmail: {
    required: false,
    type: String,
  },
  userId: {
    required: false,
    type: String,
  },
  items: [PaymentItemSchema],
  createdAt: {
    required: false,
    type: Date,
  },
  updatedAt: {
    required: false,
    type: Date,
  },
})
  .index({ createdAt: 1 })
  .index({ createdAt: -1 })
  .index({ paymentMethod: 1 });
