import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { MessagingTypeEnum, ChatMemberRoleEnum } from '@pe/message-kit';

import { DirectChatDocument, DirectChat } from '../../src/message/submodules/messaging/direct-chat';

import {
  ID_OF_DIRECT_CHAT,
  ID_OF_CONTACT,
  SALT,
  ID_OF_CONTACT_MESSAGE,
  ENCRYPTED_CONTENT,
  ID_OF_USER_1,
  ID_OF_USER_2,
  ID_OF_DIRECT_CHAT_2,
  ID_OF_USER_3,
  ID_OF_DIRECT_CHAT_3,
  ID_OF_USER_6,
  ID_OF_DIRECT_CHAT_4,
  ID_OF_USER_7,
} from './const';
import { ChatTextMessage } from '../../src/message/submodules/platform';
import { AddMemberMethodEnum } from '../../src/message';

class DirectChatsFixture extends BaseFixture {
  protected readonly directChatModel: Model<DirectChatDocument> =
    this.application.get(getModelToken(DirectChat.name));
  public async apply(): Promise<void> {
    const chatPrototype: DirectChat = {
      _id: ID_OF_DIRECT_CHAT,
      deleted: false,
      expiresAt: null,
      lastMessages: [{
        _id: ID_OF_CONTACT_MESSAGE,
        attachments: [],
        chat: ID_OF_DIRECT_CHAT,
        content: ENCRYPTED_CONTENT,
        sender: ID_OF_CONTACT,
        sentAt: new Date(),
        type: 'text',
      } as ChatTextMessage],
      members: [{
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_1,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }, {
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_2,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      },{
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_7,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Title of chat',
      type: MessagingTypeEnum.DirectChat,
    };
    await this.directChatModel.create(chatPrototype);

    await this.directChatModel.create({
      _id: ID_OF_DIRECT_CHAT_2,
      deleted: false,
      expiresAt: null,
      lastMessages: [],
      members: [{
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_2,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }, {
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_3,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Title of direct chat #2',
      type: MessagingTypeEnum.DirectChat,
    });

    const directChat3Prototype: DirectChat = {
      _id: ID_OF_DIRECT_CHAT_3,
      deleted: false,
      expiresAt: null,
      lastMessages: [],
      members: [{
        role: ChatMemberRoleEnum.Admin,
        user: ID_OF_USER_2,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_2,
      }, {
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_6,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_2,
      }],
      salt: SALT,
      title: 'Chat between 2 and 6',
      type: MessagingTypeEnum.DirectChat,
    }

    await this.directChatModel.create(directChat3Prototype);

    await this.directChatModel.create({
      _id: ID_OF_DIRECT_CHAT_4,
      deleted: false,
      expiresAt: null,
      lastMessages: [],
      members: [{
        role: ChatMemberRoleEnum.Admin,
        user: ID_OF_USER_7,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }, {
        role: ChatMemberRoleEnum.Member,
        user: ID_OF_USER_2,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_7,
      }],
      salt: SALT,
      title: 'Direct chat of user 7',
      type: MessagingTypeEnum.DirectChat,
    })
  }
}

export = DirectChatsFixture;
