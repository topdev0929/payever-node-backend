import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractChatMessageDocument, AbstractChatMessage } from '../../src/message/submodules/platform';
import {
  ID_OF_CUSTOMER_CHAT,
  ID_OF_CONTACT,
  ENCRYPTED_CONTENT,
  ID_OF_USER_1,
  ID_OF_USER_4,
  ID_OF_USER_2,
  ID_OF_EVENT_MESSAGE_1,
  ID_OF_EVENT_MESSAGE_2,
} from './const';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import { EventMessageTypeEnum } from '../../src/message';

class EventMessageFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  public async apply(): Promise<void> {
    await this.messageModel.create({
      _id: ID_OF_EVENT_MESSAGE_1,
      chat: ID_OF_CUSTOMER_CHAT,
      sender: ID_OF_CONTACT,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'event',
      eventName: EventMessageTypeEnum.IncludeMember,
      data: {
        includedById: ID_OF_USER_1,
        includedUserId: ID_OF_USER_4,
      }
    });

    
    await this.messageModel.create({
      _id: ID_OF_EVENT_MESSAGE_2,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_USER_1,
      sentAt: new Date(),
      type: 'event',
      editedAt: null,
      eventName: EventMessageTypeEnum.ExcludeMember,
      data: {
        excludedById: ID_OF_USER_1,
        excludedUserId: ID_OF_USER_2,
      }
    });
  }
}

export = EventMessageFixture;
