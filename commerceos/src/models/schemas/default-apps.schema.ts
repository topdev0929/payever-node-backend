import { Schema } from 'mongoose';
import { installedAppSchema } from './installed-app.schema';
import { appTypes } from './app-types';

export const defaultAppsSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      validate: {
        validator: (x: string): boolean => appTypes.includes(x),
      },
    },
    installedApps: [installedAppSchema],
  },
  { timestamps: true },
);
