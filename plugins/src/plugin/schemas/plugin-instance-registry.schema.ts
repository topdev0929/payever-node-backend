import { Schema } from 'mongoose';
import * as updateVersioningPlugin from 'mongoose-update-versioning';
import { PluginCommandNameEnum } from '../enums';
import { PluginCommandSchemaName } from './plugin-command.schema';

export const PluginInstanceRegistrySchemaName: string = 'PluginInstanceRegistry';

export const PluginInstanceRegistrySchema: Schema = new Schema(
  {
    _id: { type: String },
    acknowledgedCommands: [{ type: Schema.Types.String, required: true, ref: PluginCommandSchemaName }],
    businessIds: { type: [String], required: false, default: [] },
    channel: { type: String, required: true },
    cmsVersion: { type: String, required: true },
    commandEndpoint: { type: String, required: false },
    host: { type: String, required: true },
    pluginVersion: { type: String, required: true },
    supportedCommands: { type: [String], enum: Object.values(PluginCommandNameEnum), required: true },
  },
  {
    timestamps: { },
  },
);

PluginInstanceRegistrySchema.plugin(updateVersioningPlugin);
