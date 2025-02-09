import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import { MessagingTypeEnum } from '@pe/message-kit';

import {
  ChatTemplateDocument,
  ChatMessageTemplateDocument,
} from '../../src/message/submodules/templates';
import {
  AbstractChatMessage,
  AbstractChatMessageDocument,
  ChatTextMessage,
} from '../../src/message/submodules/platform';
import {
  ChatAppEnum,
} from '../../src/message';
import {
  AppChannelDocument,
  AppChannel,
} from '../../src/message/submodules/messaging/app-channels';
import {
  ID_OF_EXISTING_BUSINESS,
  ID_OF_CHAT_TEMPLATE,
  ID_OF_CHAT_MESSAGE_TEMPLATE_1,
  ID_OF_CHANNEL,
  ID_OF_USER_MESSAGE,
  ID_OF_USER_1,
  DECRYPTED_CONTENT,
  ENCRYPTED_CONTENT,
  SALT,
} from './const';

class TemplateFixture extends BaseFixture {
  protected readonly appChannelChatModel: Model<AppChannelDocument> =
    this.application.get(getModelToken(AppChannel.name));
  protected readonly chatMessageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));

  protected readonly chatTemplateModel: Model<ChatTemplateDocument> = this.application.get(`ChatTemplateModel`);
  protected readonly chatMessageTemplateModel: Model<ChatMessageTemplateDocument> = this.application.get(`ChatMessageTemplateModel`);

  public async apply(): Promise<void> {
    await this.appChannelChatModel.create({
      _id: ID_OF_CHANNEL,
      app: ChatAppEnum.Shop,
      business: ID_OF_EXISTING_BUSINESS,
      deleted: false,
      expiresAt: null,
      salt: SALT,
      template: ID_OF_CHAT_TEMPLATE,
      title: 'payever Shop Bot',
      type: MessagingTypeEnum.AppChannel,
      description: '',
      photo: '',
      signed: false,
      lastMessages: [],
      members: [],
    });

    const messagePrototype: ChatTextMessage = {
      _id: ID_OF_USER_MESSAGE,
      attachments: [],
      chat: ID_OF_CHANNEL,
      template: ID_OF_CHAT_MESSAGE_TEMPLATE_1,
      content: ENCRYPTED_CONTENT,
      type: 'text',
      sender: ID_OF_USER_1,
      sentAt: new Date(),
    };

    await this.chatMessageModel.create(messagePrototype);
  }
}

export = TemplateFixture;
