import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const IntegrationLinkSchemaName: string = 'IntegrationLink';
export const IntegrationLinkSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  business: {
    index: true,
    type: String,
  },
  chat: {
    type: String,
  },
  creator: {
    index: true,
    type: String,
  },
  deleted: {
    default: false,
    type: Boolean,
  },
}, {
  timestamps: true,
});
