import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from '@pe/business-kit';
import { AppSchemaName } from './app.schema';

export const EventSubscriptionSchemaName: string = 'EventSubscription';
export const EventSubscriptionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    appId: {
      type: Schema.Types.String,
    },
    businessId: {
      required: true,
      type: Schema.Types.String,
    },
    connection: {
      type: Schema.Types.Mixed,
    },
    events: {
      type: [String],
    },
  },
  {
    timestamps: { },
  },
);

EventSubscriptionSchema.index({ appId: 1 });
EventSubscriptionSchema.index({ businessId: 1 });

EventSubscriptionSchema.virtual('app', {
  foreignField: '_id',
  justOne: true,
  localField: 'appId',
  ref: AppSchemaName,
});

EventSubscriptionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
