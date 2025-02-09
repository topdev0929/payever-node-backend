import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ShopEventsTypesEnum } from '../enums';

export const SubscriptionsEventsSchemaName: string = 'SubscriptionsEvents';
export const SubscriptionsEventsSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  applicationId: {
    required: true,
    type: String,
  },
  browser: {
    default: null,
    required: false,
    type: String,
  },
  businessId: {
    required: true,
    type: String,
  },
  clientId: {
    required: true,
    type: String,
  },
  device: {
    default: null,
    required: false,
    type: String,
  },
  element: {
    required: false,
    type: String,
  },
  sessionId: {
    required: true,
    type: String,
  },
  type: {
    enum:
      [
        ShopEventsTypesEnum.CLICK,
        ShopEventsTypesEnum.PAGE_VIEW,
        ShopEventsTypesEnum.ECOM,
      ],
    required: false,
    type: String,
  },
  url: {
    required: false,
    type: String,
  },
}, {
  timestamps: true,
});

