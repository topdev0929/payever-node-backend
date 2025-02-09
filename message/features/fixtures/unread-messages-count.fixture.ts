import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractChatMessageDocument, AbstractChatMessage } from '../../src/message/submodules/platform';
import {
  ID_OF_CUSTOMER_CHAT,
  ID_OF_CONTACT,
  ENCRYPTED_CONTENT,
  ID_OF_USER_1,
  ID_OF_USER_2,
  ID_OF_USER_3,
} from './const';
import { ChatMessageStatusEnum } from '@pe/message-kit';

class UnreadMessageFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  public async apply(): Promise<void> {
    await this.messageModel.create({
      _id: 'id-of-user-message-1',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_CONTACT,
      sentAt: new Date('2022-01-01 01:01:01'),
      status: ChatMessageStatusEnum.SENT,
      type: 'text',
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-2',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_USER_2,
      sentAt: new Date('2022-01-01 01:01:02'),
      type: 'text',
      editedAt: null,
    });
    
    await this.messageModel.create({
      _id: 'id-of-user-message-3',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_CONTACT,
      sentAt: new Date('2022-01-01 01:01:03'),
      status: ChatMessageStatusEnum.SENT,
      type: 'text',      
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-4',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [
        ID_OF_USER_1,
      ],
      sender: ID_OF_USER_2,
      sentAt: new Date('2022-01-01 01:01:04'),
      type: 'text',
      editedAt: null,
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-5',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [],
      sender: ID_OF_USER_2,
      sentAt: new Date('2022-01-01 01:01:05'),
      type: 'text',
      editedAt: null,
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-6',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [],
      sender: ID_OF_USER_2,      
      sentAt: new Date('2022-01-01 01:01:06'),
      type: 'text',
      editedAt: null,
      status: 'deleted'
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-7',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [],
      sender: ID_OF_USER_1,      
      sentAt: new Date('2022-01-01 01:01:07'),
      type: 'text',
      editedAt: null,
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-8',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      deletedForUsers: [],
      readBy: [
        ID_OF_USER_1,
      ],
      sender: ID_OF_USER_2,
      sentAt: new Date('2022-01-01 01:01:08'),
      type: 'text',
      editedAt: null,
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-9',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      deletedForUsers: [],
      readBy: [],
      sender: ID_OF_USER_3,
      sentAt: new Date('2022-01-01 01:01:09'),
      type: 'box',
      editedAt: null,
    });

    await this.messageModel.create({
      _id: 'id-of-user-message-10',
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      deletedForUsers: [],
      readBy: [],
      sender: ID_OF_USER_3,
      sentAt: new Date('2022-01-01 01:02:09'),
      type: 'event',
      editedAt: null,
    });
  }
}

export = UnreadMessageFixture;
