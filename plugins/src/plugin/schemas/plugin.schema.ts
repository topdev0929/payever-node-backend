import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PluginFileSchema } from './plugin-file.schema';

export const PluginSchemaName: string = 'Plugin';

export const PluginSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    channel: { type: Schema.Types.String, required: true, ref: 'Channel' },
    description: String,
    documentation: String,
    marketplace: String,
    pluginFiles: [PluginFileSchema],
  },
  {
    timestamps: { },
  },
)
  .index({ channel: 1 });
