import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractChatMessageDocument, AbstractChatMessage, ChatTextMessage } from '../../src/message/submodules/platform';
import {
  ID_OF_CONTACT_MESSAGE,
  ID_OF_CUSTOMER_CHAT,
  ID_OF_CONTACT,
  ENCRYPTED_CONTENT,
  ID_OF_USER_MESSAGE,
  ID_OF_USER_1,
  ID_OF_CONTACT_MESSAGE_2,  
  ID_OF_USER_MESSAGE_2,
  ID_OF_USER_MESSAGE_3,
} from './const';
import { ChatMessageStatusEnum } from '@pe/message-kit';

class MessageFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  public async apply(): Promise<void> {
    const messagePrototype1: ChatTextMessage = {
      _id: ID_OF_CONTACT_MESSAGE,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_CONTACT,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'text',

    };
    await this.messageModel.create(messagePrototype1);

    const messageProtoype2: ChatTextMessage = {
      _id: ID_OF_USER_MESSAGE,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_USER_1,
      sentAt: new Date(),
      type: 'text',
      editedAt: null,
    };
    await this.messageModel.create(messageProtoype2);
    
    await this.messageModel.create({
      _id: ID_OF_CONTACT_MESSAGE_2,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_CONTACT,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'text',      
    });

    await this.messageModel.create({
      _id: ID_OF_USER_MESSAGE_2,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [
        ID_OF_USER_1,
      ],
      sender: ID_OF_USER_1,
      sentAt: new Date(),
      type: 'text',
      editedAt: null,
    });

    await this.messageModel.create({
      _id: ID_OF_USER_MESSAGE_3,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [],
      sender: ID_OF_USER_1,
      sentAt: new Date(),
      type: 'text',
      editedAt: null,
      replyTo: ID_OF_CONTACT_MESSAGE,
      replyToContent: ENCRYPTED_CONTENT,
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-deleted-for-user-1',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [
        ID_OF_USER_1,
      ],
      sender: ID_OF_USER_1,
      sentAt: new Date(),
      type: 'text',
      editedAt: null,
    });
  }
}

export = MessageFixture;
