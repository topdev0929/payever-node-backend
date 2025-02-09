import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { MessagingIntegrationsEnum, MessagingTypeEnum, ChatMemberRoleEnum } from '@pe/message-kit';
import { CustomerChatDocument, CustomerChat } from '../../src/message/submodules/messaging/customer-chat';
import {
  ID_OF_CUSTOMER_CHAT,
  ID_OF_EXISTING_BUSINESS,
  ID_OF_CONTACT,
  SALT,
  ID_OF_CONTACT_MESSAGE,
  ENCRYPTED_CONTENT,
  ID_OF_USER_1,
  ID_OF_USER_2,
  ID_OF_USER_3,
  ID_OF_CUSTOMER_CHAT_2,
  ID_OF_PIN,
  ID_OF_CUSTOMER_CHAT_3,
  ID_OF_BUSINESS_2,
  ID_OF_USER_7,
  ID_OF_CUSTOMER_CHAT_4,
  ID_OF_BUSINESS_3,
  ID_OF_PIN_3,
  ID_OF_PIN_2,
  ID_OF_USER_MESSAGE,
  ID_OF_USER_4,
  ID_OF_EVENT_MESSAGE_1,
  ID_OF_EVENT_MESSAGE_2,
  ID_OF_PIN_4,
} from './const';
import { AbstractChatMessage, ChatTextMessage } from '../../src/message/submodules/platform';
import { AddMemberMethodEnum, EventMessageTypeEnum } from '../../src/message';
import { ChatEventMessageDocument } from '../../src/message/submodules/platform/schemas/message/event';

class CustomerChatsFixture extends BaseFixture {
  protected readonly customerChatModel: Model<CustomerChatDocument> =
    this.application.get(getModelToken(CustomerChat.name));
  public async apply(): Promise<void> {
    const chatPrototype1: CustomerChat = {
      _id: ID_OF_CUSTOMER_CHAT,
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.WhatsApp,
      pinned: [
        {
        _id: ID_OF_PIN,
        messageId: ID_OF_CONTACT_MESSAGE,
        pinner: ID_OF_USER_1,
        forAllUsers: true,
      },
      {
        _id: ID_OF_PIN_2,
        messageId: ID_OF_USER_MESSAGE,
        pinner: ID_OF_USER_2,
        forAllUsers: true,
      },
      {
        _id: ID_OF_PIN_3,
        messageId: ID_OF_USER_MESSAGE,
        pinner: ID_OF_USER_2,
        forAllUsers: true,
      },
      {
        _id:ID_OF_PIN_4,
        messageId: 'id-of-user-message-deleted-for-user-1',
        pinner: ID_OF_USER_2,
        forAllUsers: true,
      }
    ],
      lastMessages: [
        {
          _id: ID_OF_CONTACT_MESSAGE,
          attachments: [],
          chat: ID_OF_CUSTOMER_CHAT,
          content: ENCRYPTED_CONTENT,
          sender: ID_OF_CONTACT,
          sentAt: new Date(),
          type: 'text',
        } as ChatTextMessage,
        {
          _id: ID_OF_EVENT_MESSAGE_1,
          chat: ID_OF_CUSTOMER_CHAT,
          sender: ID_OF_CONTACT,
          sentAt: new Date(),
          type: 'event',
          eventName: EventMessageTypeEnum.IncludeMember,
          data: {
            includedById: ID_OF_USER_1,
            includedUserId: ID_OF_USER_4,
          }
        } as AbstractChatMessage,
        {
          _id: ID_OF_EVENT_MESSAGE_2,
          attachments: [],
          chat: ID_OF_CUSTOMER_CHAT,
          content: ENCRYPTED_CONTENT,
          sender: ID_OF_CONTACT,
          sentAt: new Date(),
          type: 'event',
          eventName: EventMessageTypeEnum.ExcludeMember,
          data: {
            excludedById: ID_OF_USER_1,
            excludedUserId: ID_OF_USER_2,
          }
        } as AbstractChatMessage,
        {
          _id: ID_OF_USER_MESSAGE,
          attachments: [],
          chat: ID_OF_CUSTOMER_CHAT,
          content: ENCRYPTED_CONTENT,
          sender: ID_OF_USER_1,
          sentAt: new Date(),
          type: 'text',
          editedAt: null,
        } as AbstractChatMessage,
      ],
      members: [{
        user: ID_OF_USER_1,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }, {
        user: ID_OF_USER_2,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Title of chat',
      type: MessagingTypeEnum.CustomerChat,
    };

    await this.customerChatModel.create(chatPrototype1);

    const chatPrototype2: CustomerChat = {
      _id: ID_OF_CUSTOMER_CHAT_2,
      business: ID_OF_EXISTING_BUSINESS,
      contact: ID_OF_CONTACT,
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Email,
      lastMessages: [],
      members: [{
        user: ID_OF_USER_2,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_2,
      }, {
        user: ID_OF_USER_3,
        role: ChatMemberRoleEnum.Member,
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: ID_OF_USER_2,
      }],
      salt: SALT,
      title: 'Title of direct chat #2',
      type: MessagingTypeEnum.CustomerChat,
    };

    await this.customerChatModel.create(chatPrototype2);


    // Create chat for business 2    
    await this.customerChatModel.create({
      _id: ID_OF_CUSTOMER_CHAT_3,
      business: ID_OF_BUSINESS_2,
      contact: ID_OF_CONTACT,
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Email,
      lastMessages: [],
      members: [
        {
          user: ID_OF_USER_2,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_2,
        }, {
          user: ID_OF_USER_3,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_2,
        },
        {
          user: ID_OF_USER_7,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_2,
        },
      ],
      salt: SALT,
      title: 'Business 2 Chat 1',
      type: MessagingTypeEnum.CustomerChat,
    });


    // Create chat for business 3    
    await this.customerChatModel.create({
      _id: ID_OF_CUSTOMER_CHAT_4,
      business: ID_OF_BUSINESS_3,
      contact: ID_OF_CONTACT,
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Email,
      lastMessages: [
        {
          _id: 'chat4-message1',
          attachments: [],
          chat: ID_OF_CUSTOMER_CHAT_4,
          content: ENCRYPTED_CONTENT,
          sender: ID_OF_CONTACT,
          sentAt: new Date(),
          type: 'text',
        } as AbstractChatMessage
      ],
      members: [
        {
          user: ID_OF_USER_2,
          role: ChatMemberRoleEnum.Member,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_2,
        }
      ],
      salt: SALT,
      title: 'Business 3 Chat 1',
      type: MessagingTypeEnum.CustomerChat,
    });
  }
}

export = CustomerChatsFixture;
