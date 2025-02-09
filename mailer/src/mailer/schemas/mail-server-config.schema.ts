import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MailServerConfigSchemaName: string = 'MailServerConfig';

export const MailServerConfigSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    host: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    port: {
      required: true,
      type: Number,
    },
    serverType: {
      required: true,
      type: String,
    },
    user: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

