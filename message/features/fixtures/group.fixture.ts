import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ChatMemberRoleEnum, MessagingTypeEnum } from '@pe/message-kit';
import { ChatInviteDocument } from '../../src/message/submodules/invites';
import { GroupChatDocument, GroupChat } from '../../src/message/submodules/messaging/group-chats';
import {
  ID_OF_USER_1,
  ID_OF_USER_2,
  ID_OF_GROUP_1,
  ID_OF_EXISTING_BUSINESS,
  ID_OF_USER_MESSAGE,
  SALT,
  ID_OF_CONTACT_MESSAGE,
  ENCRYPTED_CONTENT,
  ID_OF_FOLDER_1,
  ID_OF_GROUP_2,
  ID_OF_USER_3,
  ID_OF_USER_6,
  ID_OF_GROUP_3,
  ID_OF_BUSINESS_2,
  ID_OF_USER_7,
} from './const';
import { ChatTextMessage } from '../../src/message/submodules/platform';
import { AddMemberMethodEnum } from '../../src/message';

class GroupFixture extends BaseFixture {
  protected readonly groupChatModel: Model<GroupChatDocument> =
    this.application.get(getModelToken(GroupChat.name));
  protected readonly chatInviteModel: Model<ChatInviteDocument> = this.application.get(`ChatInviteModel`);

  public async apply(): Promise<void> {
    await this.groupChatModel.create({
      _id: ID_OF_GROUP_1,
      business: ID_OF_EXISTING_BUSINESS,
      deleted: false,
      expiresAt: null,
      lastMessages: [
        {
          _id: ID_OF_CONTACT_MESSAGE,
          attachments: [],
          chat: ID_OF_GROUP_1,
          content: ENCRYPTED_CONTENT,
          sender: ID_OF_USER_MESSAGE,
          sentAt: new Date(),
          type: 'text',
        } as ChatTextMessage,
      ],
      members: [
        {
          user: ID_OF_USER_1,
          role: ChatMemberRoleEnum.Admin,
          addMethod: AddMemberMethodEnum.OWNER,
          addedBy: ID_OF_USER_1,
        },
        {
          user: ID_OF_USER_2,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_1,
        },
        {
          user: ID_OF_USER_7,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_1,
        },
      ],
      salt: SALT,
      title: 'Title of group',
      type: MessagingTypeEnum.Group,
      description: '',
      photo: '',
      parentFolderId: ID_OF_FOLDER_1,
      permissions: {
        live: false,
        sendMessages: false,
      },
      usedInWidget: false,
    });

    await this.chatInviteModel.create({
      code: 'XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT',
      chat: ID_OF_GROUP_1,
    });

    await this.groupChatModel.create({
      _id: ID_OF_GROUP_2,
      business: ID_OF_EXISTING_BUSINESS,
      deleted: false,
      expiresAt: null,
      lastMessages: [{
        _id: ID_OF_CONTACT_MESSAGE,
        attachments: [],
        chat: ID_OF_GROUP_2,
        content: ENCRYPTED_CONTENT,
        sender: ID_OF_USER_MESSAGE,
        sentAt: new Date(),
        type: 'text',
      } as ChatTextMessage],
      members: [{
        user: ID_OF_USER_3,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_1,
      }, {
        user: ID_OF_USER_2,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }, {
        user: ID_OF_USER_6,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Title of group',
      type: MessagingTypeEnum.Group,
      description: '',
      photo: '',

      parentFolderId: ID_OF_FOLDER_1,
    });

    await this.groupChatModel.create({
      _id: ID_OF_GROUP_3,
      business: ID_OF_BUSINESS_2,
      subType: 'support',
      deleted: false,
      expiresAt: null,
      lastMessages: [],
      members: [{
        user: ID_OF_USER_7,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_3,
      }],
      salt: SALT,
      title: 'Title of group for business 2',
      type: MessagingTypeEnum.Group,
      description: '',
      photo: '',
      parentFolderId: ID_OF_FOLDER_1,
    });
  }
}

export = GroupFixture;
