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

class MarkUnreadMessageFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  public async apply(): Promise<void> {
    await this.messageModel.create({
      _id: ID_OF_CONTACT_MESSAGE,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      content: ENCRYPTED_CONTENT,
      sender: ID_OF_CONTACT,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      readBy: [
        ID_OF_USER_1,
      ],
      type: 'text',
    });
  }
}

export = MarkUnreadMessageFixture;
