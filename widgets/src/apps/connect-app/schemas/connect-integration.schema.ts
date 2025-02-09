import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { DisplayOptionsSchema } from './connect-display-options.schema';
import { InstallationOptionsSchema } from './connect-installation-options.schema';

export const ConnectIntegrationSchemaName: string = 'ConnectIntegration';
export const ConnectIntegrationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    category: String,
    connect: { type: Schema.Types.Mixed },
    displayOptions: DisplayOptionsSchema,
    installationOptions: InstallationOptionsSchema,
    name: {
      required: true,
      type: String,
      unique: true,
    },
  },
  {
    timestamps: { },
  },
);
