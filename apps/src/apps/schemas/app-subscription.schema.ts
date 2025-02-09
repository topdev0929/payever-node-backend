import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName } from '@pe/business-kit';
import { AppSchemaName } from './app.schema';

export const AppSubscriptionSchemaName: string = 'AppSubscription';
export const AppSubscriptionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    appId: {
      required: true,
      type: Schema.Types.String,
    },
    businessId: {
      required: true,
      type: Schema.Types.String,
    },
    installed: {
      default: false,
      type: Schema.Types.Boolean,
    },
  },
  {
    timestamps: { },
  },
);

AppSubscriptionSchema.index({ appId: 1 });
AppSubscriptionSchema.index({ businessId: 1 });

AppSubscriptionSchema.virtual('app', {
  foreignField: '_id',
  justOne: true,
  localField: 'appId',
  ref: AppSchemaName,
});

AppSubscriptionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
