import { Schema, Document } from 'mongoose';
import {
  MessagingTypeEnum,
} from '@pe/message-kit';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatAppEnum } from '../../../../enums';
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
export class AppChannel extends AbstractChannel {
  public type: MessagingTypeEnum.AppChannel;

  @Prop({
    index: true,
    required: true,
  })
  public business: string;

  @Prop({
    enum: Object.values(ChatAppEnum),
    index: true,
    required: true,
    type: String,
  })
  public app: ChatAppEnum;

  public static isTypeOf(chat: AbstractMessaging): chat is AppChannel;
  public static isTypeOf(chat: AbstractMessagingDocument): chat is AppChannelDocument {
    return chat.type === MessagingTypeEnum.AppChannel;
  }
}

export interface AppChannelDocument extends Document<string>, AppChannel {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
}

export const AppChannelSchema: Schema<AppChannelDocument> = SchemaFactory.createForClass(AppChannel);
