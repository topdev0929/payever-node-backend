import { Schema, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatMemberRoleEnum, ChatMemberInterface } from '@pe/message-kit';
import { AddMemberMethodEnum } from '../../../enums';
import {
  MemberPermissions,
  MemberPermissionsSchema,
  MemberPermissionsEmbeddedDocument,
} from './member-permissions.schema';
import { User } from '../../../../projections';
import { GuestUserInterface } from '../interfaces';

@SchemaDecorator({
  _id: false,
  id: false,
  timestamps: true,
})
export class ChatMember implements Omit<ChatMemberInterface, 'permissions'> {

  @Prop({ type: String, required: false }) // Manually adding _id property
  public _id?: string;

  @Prop()
  public notificationDisabledUntil?: Date;

  @Prop()
  public joinedAt?: Date;

  @Prop()
  public lastActivity?: Date;

  @Prop({
    type: MemberPermissionsSchema,
  })
  public permissions?: MemberPermissions;

  @Prop({
    default: ChatMemberRoleEnum.Member,
    enum: Object.values(ChatMemberRoleEnum),
    type: String,
  })
  public role: ChatMemberRoleEnum;

  @Prop({
    index: true,
    ref: User.name,
    required: true,
    type: String,
  })
  public user: string;

  @Prop({
    type: {
      _id: String,
      email: String,
      firstName: String,
      lastName: String,
      logo: String,
      phone: String,
    },
  })
  public userAccount?: {
    _id?: string;
    email: string;
    firstName: string;
    lastName: string;
    logo: string;
    phone: string;
  };

  @Prop({
    type: {
      authId: String,
      chatId: String,
      contactId: String,
      tokenId: String,
    },
  })
  public guestUser?: GuestUserInterface;

  @Prop({
    required: true,
  })
  public addedBy: string;

  @Prop({
    required: false,
  })
  public addedByInvitationLink?: boolean;

  @Prop({
    required: false,
  })
  public removedBy?: string;

  @Prop({
    required: false,
  })
  public hasLeft?: boolean;

  @Prop({
    enum: AddMemberMethodEnum,
    required: true,
    type: String,
  })
  public addMethod: AddMemberMethodEnum;

  public static hasPermission(member: ChatMember, permission: keyof MemberPermissions): boolean {
    if (!member) {
      return false;
    }
    if (member.role === ChatMemberRoleEnum.Admin) {
      return true;
    }
    if (member.role === ChatMemberRoleEnum.Subscriber) {
      const subscriberPermissions: MemberPermissions = {
        sendMedia: false,
        sendMessages: false,
      };

      return subscriberPermissions[permission] || false;
    }
    if (!member.permissions) {
      return true;
    }

    return member.permissions[permission];
  }

  public static isRoleHigherThen(role1: ChatMemberRoleEnum, role2: ChatMemberRoleEnum): boolean {
    const rolesGrades: { [key in ChatMemberRoleEnum]: number } = {
      admin: 5,
      member: 3,
      subscriber: 1,
    };

    return rolesGrades[role1] > rolesGrades[role2];
  }
}

export interface ChatMemberEmbeddedDocument extends Types.EmbeddedDocument, ChatMember {
  permissions?: MemberPermissionsEmbeddedDocument;
  _id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const ChatMemberSchema: Schema = SchemaFactory.createForClass(ChatMember);
