import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MemberSchema } from './member.schema';

export const ChatSchemaName: string = 'Chat';

export const ChatSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    lastSeen: Date,
    members: [MemberSchema],
    name: String,
    photo: String,
    type: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
