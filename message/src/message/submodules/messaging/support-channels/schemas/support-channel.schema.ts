import { Schema, Document } from 'mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';
import { SchemaFactory, Schema as SchemaDecorator } from '@nestjs/mongoose';

import {
  AbstractChannel,
  AbstractMessaging,
  AbstractMessagingDocument,
  AbstractChatMessageEmbeddedDocument,
} from '../../../platform';
import { PinnedEmbeddedDocument } from '../../../platform/schemas/pinned.schema';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class SupportChannel extends AbstractChannel {
  public readonly type: MessagingTypeEnum.SupportChannel;

  public static isTypeOf(chat: AbstractMessaging): chat is SupportChannel;
  public static isTypeOf(chat: AbstractMessagingDocument): chat is SupportChannelDocument {
    return chat.type === MessagingTypeEnum.SupportChannel;
  }
}

export interface SupportChannelDocument extends Document<string>, SupportChannel {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
}

export const SupportChannelSchema: Schema<SupportChannelDocument> =
  SchemaFactory.createForClass(SupportChannel);
