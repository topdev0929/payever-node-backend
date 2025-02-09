import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { AbstractChatMessageDocument, AbstractChatMessage } from '../../src/message/submodules/platform';
import {
  ID_OF_CUSTOMER_CHAT,
  ENCRYPTED_CONTENT,
  ID_OF_USER_1,
} from './const';

class MessageFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  public async apply(): Promise<void> {
    const date = moment();
    for (let i = 0; i <= 99; i++) {
      await this.messageModel.create({
        _id: `message-id-${i}`,
        attachments: [],
        chat: ID_OF_CUSTOMER_CHAT,
        content: ENCRYPTED_CONTENT,
        sender: ID_OF_USER_1,
        sentAt: new Date(),
        type: 'text',
        createdAt: date.add(1, 'second').toDate(),
        editedAt: null,
      });
    }
  }
}

export = MessageFixture;
