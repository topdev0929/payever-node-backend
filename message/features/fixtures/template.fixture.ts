import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import { MessagingIntegrationsEnum, MessagingTypeEnum } from '@pe/message-kit';
import {
  ChatAppEnum,
} from '../../src/message';
import {
  ChatMessageTemplateDocument,
  ChatTemplateDocument,
} from '../../src/message/submodules/templates';
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
  ID_OF_CHAT_MESSAGE_TEMPLATE_2,
} from './const';

import {
  ChatTemplatePrototype,
  templatesFixture,
  BUSINESS_SUPPORT_CHANNEL,
} from '../../fixtures/templates.fixture';
const businessSupportChannelFixture: ChatTemplatePrototype = templatesFixture.find(item => item._id === BUSINESS_SUPPORT_CHANNEL);

class TemplateFixture extends BaseFixture {
  protected readonly appChannelChatModel: Model<AppChannelDocument> =
    this.application.get(getModelToken(AppChannel.name));

  protected readonly chatTemplateModel: Model<ChatTemplateDocument> = this.application.get(`ChatTemplateModel`);
  protected readonly chatMessageTemplateModel: Model<ChatMessageTemplateDocument> = this.application.get(`ChatMessageTemplateModel`);

  public async apply(): Promise<void> {
    await this.chatTemplateModel.create({
      _id: ID_OF_CHAT_TEMPLATE,
      app: ChatAppEnum.Shop,
      title: 'payever Shop Bot',
      description: 'Template description',
      type: MessagingTypeEnum.AppChannel,
    });

    await this.chatMessageTemplateModel.create({
      _id: ID_OF_CHAT_MESSAGE_TEMPLATE_1,
      attachments: [],
      chatTemplate: ID_OF_CHAT_TEMPLATE,
      content: DECRYPTED_CONTENT,
      sender: ID_OF_USER_1,
      type: 'text',
    });

    await this.chatMessageTemplateModel.create({
      _id: ID_OF_CHAT_MESSAGE_TEMPLATE_2,
      type: 'box',
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360023894674-How-to-setup-a-shop',
        defaultLanguage: 'en',
        translations: {
          en: 'Get a quick Tour',
        },
      },
      attachments: [],
      chatTemplate: ID_OF_CHAT_TEMPLATE,
    });

    for (const templateFixture of templatesFixture) {
      await this.chatTemplateModel.create(templateFixture);
      for (const message of templateFixture.messages) {
        await this.chatMessageTemplateModel.create(message);
      }
    }
  }
}

export = TemplateFixture;
