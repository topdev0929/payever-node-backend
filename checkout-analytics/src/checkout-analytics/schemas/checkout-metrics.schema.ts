/* tslint:disable:object-literal-sort-keys */
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DeviceEnum, BrowserEnum } from '../enums';

export const CheckoutMetricsSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    paymentFlowId: {
      required: true,
      type: String,
    },
    businessId: {
      default: null,
      required: false,
      type: String,
    },
    apiCallId: {
      default: null,
      required: false,
      type: String,
    },
    newPaymentId: {
      default: null,
      required: false,
      type: String,
    },
    successPaymentId: {
      default: null,
      required: false,
      type: String,
    },
    paymentMethod: {
      default: null,
      required: false,
      type: String,
    },
    customMetrics: {
      default: [],
      required: false,
      type: [Schema.Types.Mixed],
    },
    device: {
      default: null,
      required: false,
      type: DeviceEnum,
    },
    browser: {
      default: null,
      required: false,
      type: BrowserEnum,
    },
    consoleErrors: {
      default: [],
      required: false,
      type: [String],
    },
    forceRedirect: {
      required: false,
      type: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
)
  .index({ paymentFlowId: 1 })
  .index({ paymentMethod: 1 })
  .index({ paymentMethod: 1, businessId: 1 })
  .index({ createdAt: 1, paymentFlowId: 1, paymentMethod: 1, businessId: 1 })
  .index({ createdAt: 1, newPaymentId: 1, paymentMethod: 1, businessId: 1 })
  .index({ createdAt: 1, successPaymentId: 1, paymentMethod: 1, businessId: 1 })
  .index({ createdAt: 1 })
  .index({ updatedAt: 1 })
  .index({ paymentFlowId: 1, paymentMethod: 1 });
