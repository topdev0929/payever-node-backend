import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { MessagingIntegrationsEnum, MessagingTypeEnum, } from '@pe/message-kit';
import { CustomerChatDocument, CustomerChat } from '../../src/message/submodules/messaging/customer-chat';
import { ID_OF_ANOTHER_EXISTING_BUSINESS, ID_OF_CONTACT, ID_OF_CUSTOMER_CHAT, ID_OF_EXISTING_BUSINESS, ID_OF_USER_1, ID_OF_USER_2, SALT } from './const';
import { ChannelTypeEnum } from '../../src/message';
import { CommonChannelDocument, CommonChannel } from '../../src/message/submodules/messaging/common-channels';
import { AddMemberMethodEnum } from '../../src/message';

class MessagingFilterFixture extends BaseFixture {
  protected readonly customerChatModel: Model<CustomerChatDocument> =
    this.application.get(getModelToken(CustomerChat.name));
  protected readonly channelChatModel: Model<CommonChannelDocument> =
    this.application.get(getModelToken(CommonChannel.name));

  // Customer Chat
  public async apply(): Promise<void> {
    await this.customerChatModel.create({
      _id: 'id_01',
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,      
      integrationName: MessagingIntegrationsEnum.WhatsApp,
      members: [],
      salt: SALT,
      title: 'Title of chat 01',
      type: MessagingTypeEnum.CustomerChat,
    });


    await this.customerChatModel.create({
      _id: 'id_02',
      business: ID_OF_ANOTHER_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      integrationName: MessagingIntegrationsEnum.WhatsApp,
      members: [],
      salt: SALT,
      title: 'Title of chat 02',
      type: MessagingTypeEnum.CustomerChat,
    });


    // Channel
    await this.channelChatModel.create({
      _id: 'channel_01',
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      integrationName: MessagingIntegrationsEnum.Internal,
      members: [],
      salt: SALT,
      title: 'Public channel',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Public,
    });

    await this.channelChatModel.create({
      _id: 'channel_02',
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      integrationName: MessagingIntegrationsEnum.Internal,
      members: [],
      salt: SALT,
      title: 'Private-channel',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Private,
    });

    await this.channelChatModel.create({
      _id: 'channel_03',
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      integrationName: MessagingIntegrationsEnum.Internal,
      members: [
        { user: ID_OF_USER_1, addedBy: ID_OF_USER_1, addMethod: AddMemberMethodEnum.OWNER }
      ],
      salt: SALT,
      title: 'Public-channel-with-member',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Public,
    });

    await this.channelChatModel.create({
      _id: 'channel_04',
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      integrationName: MessagingIntegrationsEnum.Internal,
      members: [
        { user: ID_OF_USER_1, addedBy: ID_OF_USER_1, addMethod: AddMemberMethodEnum.OWNER }
      ],
      salt: SALT,
      title: 'Private-channel-with-member',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Private,
    });

    // Public channel to invite
    await this.channelChatModel.create({
      _id: 'channel_05',
      business: ID_OF_EXISTING_BUSINESS,
      integrationName: MessagingIntegrationsEnum.Internal,
      members: [
        { user: ID_OF_USER_1, addedBy: ID_OF_USER_1, addMethod: AddMemberMethodEnum.OWNER },
        { user: ID_OF_USER_2, addedBy: ID_OF_USER_1, addMethod: AddMemberMethodEnum.INVITE },
      ],
      salt: SALT,
      title: 'Public-channel-to-invite',
      type: MessagingTypeEnum.Channel,
      subType: ChannelTypeEnum.Public,
    });

    await this.customerChatModel.create({
      _id: 'live-chat-01',
      business: ID_OF_EXISTING_BUSINESS,
      contact:'new-contact-id',
      integrationName: MessagingIntegrationsEnum.LiveChat,
      members: [
      ],
      salt: SALT,      
      title: 'New live chat',
      type: MessagingTypeEnum.CustomerChat,      
    });
  }
}

export = MessagingFilterFixture;
