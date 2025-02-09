import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const BlogSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    business: { type: Schema.Types.String, required: true, ref: BusinessSchemaName },
    channelSet: { type: Schema.Types.String, required: true, ref: ChannelSetSchemaName },
    isDefault: { type: Boolean, default: false },
    name: { type: String, default: false },
    picture: { type: String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
