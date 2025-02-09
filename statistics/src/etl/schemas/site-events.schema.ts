import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SiteEventsTypesEnum } from '../enums/site-events-types.enum';

export const SiteEventsSchemaName: string = 'SiteEvents';
export const SiteEventsSchema: Schema = new Schema({
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
        SiteEventsTypesEnum.CLICK,
        SiteEventsTypesEnum.PAGE_VIEW,
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

