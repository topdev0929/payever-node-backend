import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const IntegrationWrapperSubscriptionSchemaName: string = 'IntegrationWrapperSubscription';

const IntegrationWrapperSubscriptionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: Schema.Types.String, ref: 'Business' },
    installed: {
      default: false,
      type: Boolean,
    },
    wrapperType: String,
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

IntegrationWrapperSubscriptionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: 'Business',
});

export { IntegrationWrapperSubscriptionSchemaName, IntegrationWrapperSubscriptionSchema };
