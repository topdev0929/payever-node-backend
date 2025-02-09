import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ConnectIntegrationSchemaName } from './connect-integration.schema';
import { MongooseModel } from '../../../common/enums';

export const ConnectIntegrationSubscriptionSchemaName: string = 'ConnectIntegrationSubscription';
export const ConnectIntegrationSubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    installed: {
      default: false,
      type: Boolean,
    },
    integration: { type: Schema.Types.String, required: true, ref: ConnectIntegrationSchemaName },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ConnectIntegrationSubscriptionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: MongooseModel.Business,
});
