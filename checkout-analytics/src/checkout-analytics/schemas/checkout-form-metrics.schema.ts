/* tslint:disable:object-literal-sort-keys */
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DeviceEnum, BrowserEnum } from '../enums';

import { CheckoutFormActionMetricsSchema } from './checkout-form-action-metrics.schema';
import { CheckoutFormSchema } from './checkout-form.schema';

export const CheckoutFormMetricsSchema: Schema = new Schema(
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
    formActions: {
      default: [],
      required: false,
      type: [CheckoutFormActionMetricsSchema],
    },
    forms: {
      default: [],
      required: false,
      type: [CheckoutFormSchema],
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
    browserVersion: {
      required: false,
      type: String,
    },
    javascriptEnabled: {
      required: false,
      type: Boolean,
    },
    cookiesEnabled: {
      required: false,
      type: Boolean,
    },
    platform: {
      required: false,
      type: String,
    },
    screenColorDepth: {
      required: false,
      type: String,
    },
    screenHeight: {
      required: false,
      type: String,
    },
    screenWidth: {
      required: false,
      type: String,
    },
    timeZone: {
      required: false,
      type: String,
    },
    userAgent: {
      required: false,
      type: String,
    },
    acceptHeader: {
      required: false,
      type: String,
    },
    language: {
      required: false,
      type: String,
    },
    consoleErrors: {
      default: [],
      required: false,
      type: [String],
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
