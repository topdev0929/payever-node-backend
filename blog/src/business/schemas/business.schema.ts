import { ChannelAwareBusinessPlugin } from '@pe/channels-sdk';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    blogs: [{ type: Schema.Types.String, required: true, ref: BlogSchemaName }],
    defaultLanguage: String,
    name: String,
    primaryColor: String,
    primaryTransparency: String,
    secondaryColor: String,
    secondaryTransparency: String,
  },
  {
    timestamps: { },
  },
);

BusinessSchema.plugin(ChannelAwareBusinessPlugin, { });
