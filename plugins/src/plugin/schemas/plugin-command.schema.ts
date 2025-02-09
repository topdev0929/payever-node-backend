import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PluginCommandNameEnum } from '../enums';

export const PluginCommandSchemaName: string = 'PluginCommand';

export const PluginCommandSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    channelType: { type: String, required: false },
    maxCmsVersion: { type: String, required: false },
    metadata: { type: { }, required: false, default: { } },
    minCmsVersion: { type: String, required: false },
    name: { type: String, enum: Object.values(PluginCommandNameEnum), required: true },
    value: String,
  },
  {
    timestamps: { },
  },
);
