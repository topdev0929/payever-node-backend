import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractChatMessageDocument, AbstractChatMessage, ChatTextMessage } from '../../../src/message/submodules/platform';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import * as constants from './const';

class MessageFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  public async apply(): Promise<void> {

    const messages = [
      constants.TEXT_MESSAGE,
      constants.TEXT_MESSAGE_2,
      constants.TEXT_MESSAGE_3,
      constants.REPLY_TO_TEXT_MESSAGE_1,
      constants.REPLY_TO_TEXT_MESSAGE_2,
      constants.REPLY_TO_TEXT_MESSAGE_3,
      constants.EVENT_MESSAGE,
      constants.EVENT_MESSAGE_2,
      constants.EVENT_MESSAGE_3,
      constants.TEMPLATE_MESSAGE,
      constants.TEMPLATE_MESSAGE_2,
      constants.TEMPLATE_MESSAGE_3,
      constants.BOX_MESSAGE,
      constants.BOX_MESSAGE_2,
      constants.BOX_MESSAGE_3,
    ];

    await Promise.all(messages.map(message=> this.messageModel.create(message)));
  }
}

export = MessageFixture;
