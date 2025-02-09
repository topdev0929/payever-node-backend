import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BlogEventsTypesEnum } from '../enums/blog-events-types.enum';

export const EventsSchemaName: string = 'Events';
export const EventsSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  applicationId: {
    required: true,
    type: String,
  },
  businessId: {
    required: true,
    type: String,
  },
  consoleErrors: {
    default: [],
    required: false,
    type: [String],
  },
  customMetrics: {
    default: [],
    required: false,
    type: [{
      browser: {
        default: null,
        required: false,
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
      type: {
        enum: 
        [
          BlogEventsTypesEnum.CLICK,
          BlogEventsTypesEnum.PAGE_VIEW,
        ],
        required: false,
        type: String,
      },
      url: {
        required: false,
        type: String,
      },
    }],
  },
  sessionId: {
    required: true,
    type: String,
  },
},                                             {
  timestamps: true,
});
