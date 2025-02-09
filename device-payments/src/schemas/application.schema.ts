/* tslint:disable:object-literal-sort-keys */
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CheckoutSchemaName } from './checkout.schema';

export const ApplicationSchemaName: string = 'Application';

export const ApplicationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    applicationId: String,
    businessId: String,
    channelSetId: String,
    checkout: {
      ref: CheckoutSchemaName,
      type: String,
    },
    name: String,
    type: String,
  },
  {
    collection: 'applications',
  },
);

ApplicationSchema.index({ businessId: 1 }, { unique: false });
ApplicationSchema.index({ applicationId: 1 }, { unique: true });
ApplicationSchema.index({ channelSetId: 1 }, { unique: true });
