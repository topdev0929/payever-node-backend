import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const LocationSchemaName: string = 'Location';

export const LocationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    hashedSubnet: String,
    name: String,
    subnet: String,
    userAgent: String,
    userId: String,
    verified: Boolean,
  },
  {
    timestamps: true,
  },
)
  .index({ userId: 1, userAgent: 1 });
