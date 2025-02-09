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
  ID_OF_EXISTING_BUSINESS,
  SALT,
  ID_OF_USER_2,
  ID_OF_USER_3,
  ID_OF_USER_4,
  CHANNEL_1_INVITE_CODE,
  CHANNEL_1_INVITE_ID,
  USERNAME_OF_USER_1,
  ID_OF_USER_6,
  CONTACT_ID,
} from './const';
import { AddMemberMethodEnum } from '../../src/message';

class ChatInviteFixture extends BaseFixture {
  protected readonly channelChatModel: Model<CommonChannelDocument> =
    this.application.get(getModelToken(CommonChannel.name));
  protected readonly chatInviteModel: Model<ChatInviteDocument> = this.application.get(`ChatInviteModel`);

  public async apply(): Promise<void> {
    const channelPrototype1: CommonChannel = {
      _id: ID_OF_CHANNEL,
      business: ID_OF_EXISTING_BUSINESS,
      contacts: [],
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Internal,
      lastMessages: [],
      members: [
        {
          user: ID_OF_USER_1,
          role: ChatMemberRoleEnum.Admin,
          addMethod: AddMemberMethodEnum.OWNER,
          addedBy: ID_OF_USER_1,
          permissions: {
            sendMedia: true,
            sendMessages: true,
          },
        },
        {
          user: ID_OF_USER_3,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_1,
        },
        {
          user: ID_OF_USER_4,
          role: ChatMemberRoleEnum.Subscriber,
          addMethod: AddMemberMethodEnum.INVITE,
          addedBy: ID_OF_USER_1,
        },
        {
          user: ID_OF_USER_6,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: USERNAME_OF_USER_1,
        },
      ],
      removedMembers: [
        {          
          user: ID_OF_USER_2,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_1,
        }
      ],
      invitedMembers: [
        {
          _id:'chat-invite-member-1',
          contactId: CONTACT_ID,
          email: 'email-1@payever.org',
          name: 'contact 1'
        }
      ],
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
  }
}

export = ChatInviteFixture;
