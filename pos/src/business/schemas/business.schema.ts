import { ChannelAwareBusinessPlugin } from '@pe/channels-sdk';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessIntegrationSubSchemaName, TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    defaultLanguage: String,
    integrationSubscriptions: [{
      ref: BusinessIntegrationSubSchemaName,
      required: true,
      type: Schema.Types.String,
    }],
    logo: String,
    name: String,
    primaryColor: String,
    primaryTransparency: String,
    secondaryColor: String,
    secondaryTransparency: String,
    terminals: [{ type: Schema.Types.String, required: true, ref: TerminalSchemaName }],
  },
  {
    timestamps: { },
  },
);

BusinessSchema.plugin(ChannelAwareBusinessPlugin, { });
