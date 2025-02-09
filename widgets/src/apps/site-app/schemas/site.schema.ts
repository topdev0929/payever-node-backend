import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SiteSchemaName: string = 'Site';

export const SiteSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    default: Boolean,
    logo: String,
    name: String,
    url: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
