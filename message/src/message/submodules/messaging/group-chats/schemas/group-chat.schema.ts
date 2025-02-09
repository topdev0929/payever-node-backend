import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import {
  MessagingTypeEnum,
  GroupChatInterface,
} from '@pe/message-kit';

import {
  AbstractMessaging,
  AbstractMessagingDocument,
  AbstractChatMessageEmbeddedDocument,

  Permissions,
  PermissionsSchema,
  PermissionsEmbeddedDocument,
} from '../../../platform';
import { PinnedEmbeddedDocument } from '../../../platform/schemas/pinned.schema';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class GroupChat extends AbstractMessaging implements GroupChatInterface {
  public readonly type: MessagingTypeEnum.Group;

  @Prop({
    required: false,
    type: String,
  })
  public subType?: string;

  @Prop({
    index: true,
    required: true,
  })
  public business: string;

  @Prop()
  public description: string;

  @Prop()
  public photo: string;

  @Prop({
    default: null,
    type: PermissionsSchema,
  })
  public permissions?: Permissions;

  @Prop({
    index: true,
  })
  public usedInWidget?: boolean;
  
  public static isTypeOf(chat: AbstractMessaging): chat is GroupChat;
  public static isTypeOf(chat: AbstractMessagingDocument): chat is GroupChatDocument {
    return chat.type === MessagingTypeEnum.Group;
  }
}

export interface GroupChatDocument extends Document<string>, GroupChat {
  _id: string;
  permissions?: PermissionsEmbeddedDocument;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
}

export const GroupChatSchema: Schema<GroupChatDocument> = SchemaFactory.createForClass(GroupChat);
