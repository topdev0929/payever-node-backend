import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const OnboardingAppInstallationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    businessInstallation: Boolean,
    widgetInstallation: Boolean,
  },
  {
    timestamps: { },
  },
);
