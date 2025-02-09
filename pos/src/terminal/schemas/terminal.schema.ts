import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessSchemaName, TerminalIntegrationSubSchemaName } from '../../mongoose-schema/mongoose-schema.names';

const DEFAULT_LOCALE: string = 'en';

export const TerminalSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    channelSets: [{ type: Schema.Types.String, required: true, ref: ChannelSetSchemaName }],
    integrationSubscriptions: [{
      ref: TerminalIntegrationSubSchemaName,
      required: true,
      type: Schema.Types.String,
    }],

    active: { type: Boolean, default: false },
    defaultLocale: { type: String, default: DEFAULT_LOCALE },
    live: { type: Boolean, default: true },
    locales: { type: [], default: [DEFAULT_LOCALE] },
    logo: { type: String },
    message: { type: String },
    name: { type: String, required: true },
    phoneNumber: { type: String },

    forceInstall: { type: Schema.Types.Boolean },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

TerminalSchema.index({ businessId: 1, name: 1 }, { unique: true });
TerminalSchema.index({ businessId: 1, active: 1 });
TerminalSchema.index({ name: 'text', message: 'text', phoneNumber: 'text' });

TerminalSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});

TerminalSchema.virtual('channelSet').get(function (): string {
  if (this.channelSets.length > 0) {
    return this.channelSets[0];
  }

  return '';
});
