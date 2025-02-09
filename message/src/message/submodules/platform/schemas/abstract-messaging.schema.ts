import { v4 as uuid } from 'uuid';
import { Schema, Document } from 'mongoose';
import {
  AbstractMessagingInterface,
  MessagingTypeEnum,
  MessagingWithIntegration,
  ChatMemberRoleEnum,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatMember, ChatMemberSchema } from './chat-member.schema';
import {
  AbstractChatMessage,
  AbstractChatMessageEmbeddedDocument,
  AbstractChatMessageSchema,
} from './message/abstract-chat-message.schema';
import { Permissions, PermissionsEmbeddedDocument } from './permissions.schema';
import { Pinned, PinnedEmbeddedDocument, PinnedSchema } from './pinned.schema';
import { ChatInvitedMember, ChatInvitedMemberSchema } from './chat-invites-member.schema';
import { User } from '../../../../projections';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class AbstractMessaging implements AbstractMessagingInterface {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id: string;

  @Prop({
    default: false,
    index: true,
  })
  public deleted?: boolean;

  @Prop()
  public expiresAt?: Date;

  @Prop({
    type: [AbstractChatMessageSchema],
  })
  public lastMessages?: AbstractChatMessage[];

  @Prop({
    type: [ChatMemberSchema],
  })
  public members: ChatMember[];

  @Prop({
    type: [ChatInvitedMemberSchema],
  })
  public invitedMembers?: ChatInvitedMember[];

  @Prop({
    type: [ChatMemberSchema],
  })
  public removedMembers?: ChatMember[];

  @Prop({
    required: true,
  })
  public salt: string;

  @Prop({
    required: false,
  })
  public template?: string;

  @Prop({
    required: true,
  })
  public title: string;

  @Prop({
    type: String,
  })
  public photo?: string;

  @Prop({
    required: false,
    type: [PinnedSchema],
  })
  public pinned?: Pinned[];

  public type: MessagingTypeEnum;

  public static hasMemberAdminRole(chat: AbstractMessaging, userId: string): boolean {
    return chat.members.some(
      (memberItem: ChatMember) => memberItem.user === userId && memberItem.role === ChatMemberRoleEnum.Admin,
    );
  }

  public static getMemberOfUser(chat: AbstractMessaging, userId: string): ChatMember {
    return chat.members.find((memberItem: ChatMember) => {
      if (typeof memberItem.user === 'string') {
        return memberItem.user === userId;
      }

      return (memberItem.user as User)._id === userId;
    });
  }

  public static hasIntegration(chat: AbstractMessaging): chat is AbstractMessaging & MessagingWithIntegration {
    return 'integrationName' in chat;
  }
  public static hasIntegrationType(chat: any, type: MessagingIntegrationsEnum): boolean {
    return chat.integrationName && chat.integrationName === type;
  }
  public static hasBusiness(chat: AbstractMessaging): chat is AbstractMessaging & { business: string } {
    return 'business' in chat;
  }

  public static hasPermissions(
    chat: AbstractMessagingDocument,
  ): chat is AbstractMessagingDocument & { permissions: PermissionsEmbeddedDocument };
  public static hasPermissions(
    chat: AbstractMessaging,
  ): chat is AbstractMessaging & { permissions: Permissions };
  public static hasPermissions(
    chat: AbstractMessaging | AbstractMessagingDocument,
  ): boolean {
    return 'permissions' in chat;
  }

  public static hasPermission(
    chat: AbstractMessaging & { permissions?: Permissions },
    permission: keyof Permissions,
  ): boolean {
    if (!chat.permissions) {
      return true;
    }

    return chat.permissions[permission];
  }

  public static memberHasPermission(
    chat: AbstractMessaging & { permissions?: Permissions },
    permission: keyof Permissions,
    memberId: string,
  ): boolean {
    if (AbstractMessaging.hasMemberAdminRole(chat, memberId)) {
      return true;
    }

    return AbstractMessaging.hasPermission(chat, permission);
  }

  public createdAt?: Date;
}

export interface AbstractMessagingDocument extends Document<string>, AbstractMessaging {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
  permissions?: PermissionsEmbeddedDocument;
}

export const AbstractMessagingSchema: Schema<AbstractMessagingDocument> =
  SchemaFactory.createForClass(AbstractMessaging);

AbstractMessagingSchema.index({
  type: 1,
});
