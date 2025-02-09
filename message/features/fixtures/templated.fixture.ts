import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MessagingTypeEnum,
} from '@pe/message-kit';

import {
  AbstractChatMessageDocument,
  AbstractChatMessage,
  ChatTextMessage,
  ChatBoxMessage,
} from '../../src/message/submodules/platform';
import {
  AppChannel,
  AppChannelDocument,
} from '../../src/message/submodules/messaging/app-channels';
import {
  ChatAppEnum,
} from '../../src/message';
import {
  ID_OF_EXISTING_BUSINESS,
  ID_OF_CONTACT,
  SALT,
  ID_OF_CHAT_TEMPLATE,
  ID_OF_TEMPLATED_APP_CHANNEL_1,
  ID_OF_TEMPLATED_APP_CHANNEL_2,
  ID_OF_USER_1,
  ID_OF_TEMPLATED_MESSAGE_1,
  ID_OF_TEMPLATED_MESSAGE_2,
  ID_OF_CHAT_MESSAGE_TEMPLATE_1,
  UPDATED_ENCRYPTED_CONTENT,
  ID_OF_CHAT_MESSAGE_TEMPLATE_2,
} from './const';

class TemplatedFixture extends BaseFixture {
  protected readonly messageModel: Model<AbstractChatMessageDocument> =
    this.application.get(getModelToken(AbstractChatMessage.name));
  protected readonly appChannelModel: Model<AppChannelDocument> = this.application.get(getModelToken(AppChannel.name));
  public async apply(): Promise<void> {
    await this.appChannelModel.create({
      _id: ID_OF_TEMPLATED_APP_CHANNEL_1,
      app: ChatAppEnum.Shop,
      business: ID_OF_EXISTING_BUSINESS,
      deleted: false,
      photo: '',
      salt: SALT,
      signed: false,
      type: MessagingTypeEnum.AppChannel,

      template: ID_OF_CHAT_TEMPLATE,
      description: 'App channel description #1',
      title: 'App Channel of Shop #1',
      lastMessages: [],
      members: [],
    });

    await this.appChannelModel.create({
      _id: ID_OF_TEMPLATED_APP_CHANNEL_2,
      app: ChatAppEnum.Site,
      business: ID_OF_EXISTING_BUSINESS,
      deleted: false,
      photo: '',
      salt: SALT,
      signed: false,
      type: MessagingTypeEnum.AppChannel,

      template: ID_OF_CHAT_TEMPLATE,
      description: 'App channel description #2',
      title: 'App Channel of Site #1',
      lastMessages: [],
      members: [],
    });

    const prototype1: ChatTextMessage = {
      _id: ID_OF_TEMPLATED_MESSAGE_1,
      attachments: [],
      chat: ID_OF_TEMPLATED_APP_CHANNEL_1,
      sender: ID_OF_USER_1,
      sentAt: new Date(),
      type: 'text',
      content: UPDATED_ENCRYPTED_CONTENT,

      template: ID_OF_CHAT_MESSAGE_TEMPLATE_1,
    };

    await this.messageModel.create(prototype1);

    const prototype2: ChatBoxMessage = {
      _id: ID_OF_TEMPLATED_MESSAGE_2,
      chat: ID_OF_TEMPLATED_APP_CHANNEL_1,
      sentAt: new Date(),
      type: 'box',
      interactive: {
        action: 'not-changed-action-value',
        defaultLanguage: 'en',
        marked: true,
        translations: {
          en: 'Get a quick Tour',
        },
      },

      template: ID_OF_CHAT_MESSAGE_TEMPLATE_2,
    };
    await this.messageModel.create(prototype2);
  }
}

export = TemplatedFixture;
