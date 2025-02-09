import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const IntegrationVersionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    description: String,
    version: String,
    versionDate: String,
  },
);
