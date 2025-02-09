import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PendingAppInstallationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    code: String,
  },
  {
    timestamps: { },
  },
);
