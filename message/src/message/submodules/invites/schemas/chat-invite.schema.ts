import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as randomstring from 'randomstring';

export const ChatInviteSchemaName: string = 'ChatInvite';
export const ChatInviteSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  chat: {
    index: true,
    type: String,
  },
  code: {
    default: randomstring.generate,
    index: true,
    type: String,
  },
  deleted: {
    default: false,
    index: true,
    type: Boolean,
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});
