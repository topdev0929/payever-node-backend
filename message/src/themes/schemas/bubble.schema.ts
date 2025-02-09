// tslint:disable: object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BubbleBrandEnum, BubbleStyleEnum, BubbleLayoutEnum } from '../enums';

export const BubbleSchemaName: string = 'Bubble';
export const BubbleSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  businessId: {
    index: true,
    required: true,
    type: String,
  },
  showBubble: {
    default: true,
    required: true,
    type: Boolean,
  },
  showNotifications: {
    default: true,
    required: true,
    type: Boolean,
  },
  brand: {
    enum: Object.values(BubbleBrandEnum),
    type: String,
  },
  style: {
    enum: Object.values(BubbleStyleEnum),
    type: String,
  },
  layout: {
    enum: Object.values(BubbleLayoutEnum),
    type: String,
  },
  logo: {
    type: String,
  },
  text: {
    type: String,
  },
  bgColor: {
    type: String,
  },
  textColor: {
    type: String,
  },
  boxShadow: {
    type: String,
  },
  roundedValue: {
    type: String,
  },
  blurBox: {
    type: String,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// For backwards compatibility
BubbleSchema.virtual('business').get(function (): string {
  return this.businessId;
});
