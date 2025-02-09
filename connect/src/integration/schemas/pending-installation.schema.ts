import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PendingInstallationSchemaName: string = 'PendingInstallation';

export const PendingInstallationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    payload: Schema.Types.Mixed,
  },
  {
    timestamps: { },
  },
);
