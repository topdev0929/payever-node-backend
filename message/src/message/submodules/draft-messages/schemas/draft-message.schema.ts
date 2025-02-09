import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator } from '@nestjs/mongoose';
import { AbstractChatTextMessage } from '../../platform';

@SchemaDecorator({
  timestamps: true,
})
export class ChatDraftMessage extends AbstractChatTextMessage { }

export interface ChatDraftMessageDocument extends ChatDraftMessage, Document<string> {
  _id: string;
}

export const ChatDraftMessageSchema: Schema<ChatDraftMessageDocument> = SchemaFactory.createForClass(ChatDraftMessage);

ChatDraftMessageSchema.index({
  chat: 1,
  sender: 1,
}, {
  unique: true,
});
