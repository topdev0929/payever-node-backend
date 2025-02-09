import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const BlockedUserSchemaName: string = 'BlockedUser';
export const BlockedUserSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  blockedUser: {
    index: true,
    required: true,
    type: String,
  },
  user: {
    index: true,
    required: true,
    type: String,
  },
}, {
  timestamps: true,
});
