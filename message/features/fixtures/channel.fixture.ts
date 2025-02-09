import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import {
  MessagingIntegrationsEnum,
  ChatMemberRoleEnum,
  MessagingTypeEnum,
} from '@pe/message-kit';
import { ChatInviteDocument } from '../../src/message/submodules/invites';
import { CommonChannelDocument, CommonChannel } from '../../src/message/submodules/messaging/common-channels';
import { ChannelTypeEnum } from '../../src/message/enums';
import {
  ID_OF_USER_1,
  ID_OF_CHANNEL,
  ID_OF_CHANNEL_2,
  ID_OF_EXISTING_BUSINESS,
  ID_OF_USER_MESSAGE,
  SALT,
  ID_OF_CONTACT_MESSAGE,
  ENCRYPTED_CONTENT,
  ID_OF_USER_2,
  ID_OF_USER_3,
  ID_OF_USER_4,
  INVITE_CODE_OF_CHANNEL_2,
  CHANNEL_1_INVITE_CODE,
  CHANNEL_1_INVITE_ID,
  CHANNEL_2_INVITE_ID,
  USERNAME_OF_USER_1,
  ID_OF_USER_6,
  ID_OF_BUSINESS_2,
  ID_OF_CHANNEL_3,
  ID_OF_USER_7,
} from './const';
import { ChatTextMessage } from '../../src/message/submodules/platform';
import { AddMemberMethodEnum } from '../../src/message';
import { GroupChat, GroupChatDocument } from '../../src/message/submodules/messaging/group-chats';

class ChannelFixture extends BaseFixture {
  protected readonly channelChatModel: Model<CommonChannelDocument> =
    this.application.get(getModelToken(CommonChannel.name));
  protected readonly groupChatModel: Model<GroupChatDocument> =
    this.application.get(getModelToken(GroupChat.name));
  protected readonly chatInviteModel: Model<ChatInviteDocument> = this.application.get(`ChatInviteModel`);

  public async apply(): Promise<void> {
    const channelPrototype1: CommonChannel = {
      _id: ID_OF_CHANNEL,
      business: ID_OF_EXISTING_BUSINESS,
      contacts: [],
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Internal,
      lastMessages: [{
        _id: ID_OF_CONTACT_MESSAGE,
        attachments: [],
        chat: ID_OF_CHANNEL,
        content: ENCRYPTED_CONTENT,
        sender: ID_OF_USER_MESSAGE,
        sentAt: new Date(),
        type: 'text',
      } as ChatTextMessage],
      members: [{
        user: ID_OF_USER_1,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_1,
        permissions: {
          sendMedia: true,
          sendMessages: true,
        },
      }, {
        user: ID_OF_USER_3,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }, {
        user: ID_OF_USER_4,
        role: ChatMemberRoleEnum.Subscriber,
        addMethod: AddMemberMethodEnum.INVITE,
        addedBy: ID_OF_USER_1,
      }, {
        user: ID_OF_USER_6,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: USERNAME_OF_USER_1,
      }],
      removedMembers: [{
        user: ID_OF_USER_2,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Public-channel',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Public,
      description: '',
      photo: '',
      signed: false,
      permissions: {
        addMembers: true,
        change: true,
        pinMessages: true,
        showSender: false,
        sendMedia: true,
        sendMessages: true,
      },
      slug: 'shop-sales-4',
      usedInWidget: true,
    };

    await this.channelChatModel.create(channelPrototype1);

    await this.chatInviteModel.create({
      _id: CHANNEL_1_INVITE_ID,
      code: CHANNEL_1_INVITE_CODE,
      chat: ID_OF_CHANNEL,
    });

    const channelPrototype2: CommonChannel = {
      _id: ID_OF_CHANNEL_2,
      business: ID_OF_EXISTING_BUSINESS,
      contacts: [],
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Internal,
      lastMessages: [{
        _id: ID_OF_CONTACT_MESSAGE,
        attachments: [],
        chat: ID_OF_CHANNEL_2,
        content: ENCRYPTED_CONTENT,
        sender: ID_OF_USER_MESSAGE,
        sentAt: new Date(),
        type: 'text',
      } as ChatTextMessage],
      members: [{
        user: ID_OF_USER_1,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_1,
      },{
        user: ID_OF_USER_7,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Private-channel',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Private,
      description: '',
      photo: '',
      signed: false,
    };

    await this.channelChatModel.create(channelPrototype2);

    await this.chatInviteModel.create({
      _id: CHANNEL_2_INVITE_ID,
      code: INVITE_CODE_OF_CHANNEL_2,
      chat: ID_OF_CHANNEL_2,
    });


    await this.channelChatModel.create({
      _id: ID_OF_CHANNEL_3,
      business: ID_OF_BUSINESS_2,
      contacts: [],
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Internal,
      lastMessages: [],
      members: [{
        user: ID_OF_USER_1,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_1,
        permissions: {
          sendMedia: true,
          sendMessages: true,
        },
      }],
      removedMembers: [],
      salt: SALT,
      title: 'Public-channel',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Public,
      description: '',
      photo: '',
      signed: false,      
      slug: 'shop-sales-4-2',
      usedInWidget: true,
    })

    await this.groupChatModel.create({
      _id: 'id-of-support-channel',
      type: 'group',
      subType: 'support',
      business: ID_OF_EXISTING_BUSINESS,
      integrationName: 'internal',
      salt: 't',
      title: 'business-number-one / Support Channel',
      template: '34a6e553-838c-4753-8539-46600ea2bc0a',
      permissions: null,
      description: '',
      members:[],
      pinned: [],
    });
  }
}

export = ChannelFixture;
