import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import {
  ApplicationSubscriptionSchemaName,
  ChannelSetSchemaName,
  CheckoutSchemaName,
  BusinessDetailSchemaName,
} from '../schema-names';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    applicationSubscriptions: [{ type: Schema.Types.String, required: true, ref: ApplicationSubscriptionSchemaName }],
    channelSets: [{ type: Schema.Types.String, required: true, ref: ChannelSetSchemaName }],
    checkouts: [{ type: Schema.Types.String, required: true, ref: CheckoutSchemaName }],

    country: String,

    businessDetail: {
      ref: BusinessDetailSchemaName,
      required: false,
      type: Schema.Types.String,
    },

    currency: String,
    defaultLanguage: String,
    name: String,
    slug: String,
  },
  {
    timestamps: { },
  },
);

BusinessSchema.index({ slug: 1 }, { unique: true, sparse: true });
