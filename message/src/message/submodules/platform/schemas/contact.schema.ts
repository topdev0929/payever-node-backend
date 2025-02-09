import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ChatMemberStatusEnum, MessagingIntegrationsEnum } from '@pe/message-kit';

export const ContactCommunicationSchema: Schema = new Schema({
  identifier: {
    index: true,
    required: true,
    type: String,
  },
  integrationName: {
    enum: Object.values(MessagingIntegrationsEnum),
    required: true,
    type: String,
  },
}, {
  _id: false,
});

export const ContactSchemaName: string = 'Contact';
export const ContactSchema: Schema = new Schema({
  _id: {
    default: uuid,
    type: String,
  },
  avatar: {
    type: String,
  },
  bot: {
    index: true,
    type: String,
  },
  business: {
    index: true,
    type: String,
  },
  communications: {
    type: [ContactCommunicationSchema],
  },
  email: {
    index: false,
    required: false,
    type: String,
  },
  lastSeen: {
    type: Date,
  },
  name: {
    index: true,
    required: true,
    type: String,
  },
  status: {
    enum: ChatMemberStatusEnum,
    type: String,
  },
}, {
  timestamps: true,
});

ContactSchema.index({ name: 'text' });
