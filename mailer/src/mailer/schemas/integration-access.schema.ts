import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const IntegrationAccessSchemaName: string = 'IntegrationAccess';

export const IntegrationAccessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: {
      required: true,
      type: String,
      unique: true,
    },

    token: String,
  },
  {
    timestamps: { },
  },
);
