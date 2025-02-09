import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PluginFileSchemaName: string = 'PluginFile';

export const PluginFileSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    filename: String,
    maxCmsVersion: String,
    minCmsVersion: String,
    version: String,
  },
  {
    timestamps: { },
  },
);
