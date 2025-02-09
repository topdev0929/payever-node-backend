// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';

import { FormActionEnum } from '../enums';

export const CheckoutFormActionMetricsSchema: Schema = new Schema(
  {
    form: {
      required: true,
      type: String,
    },
    field: {
      required: true,
      type: String,
    },
    action: {
      enum: Object.values(FormActionEnum),
      required: true,
      type: String,
    },
    validationTriggered: {
      type: Boolean,
    },
    validationError: {
      required: false,
      type: String,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: 'createdAt',
    },
  },
)
  .index({ validationTriggered: 1 })
  .index({ validationTriggered: 1, validationError: 1 })
  .index({ validationError: 1 });

