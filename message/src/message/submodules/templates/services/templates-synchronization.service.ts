import { v4 as uuid } from 'uuid';
import { pick, omit, mapKeys } from 'lodash';
import { UpdateQuery } from 'mongoose';

import { Injectable } from '@nestjs/common';

import { Encryption } from '@pe/nest-kit';
import { BusinessService, BusinessModel } from '@pe/business-kit';
import { MessagingTypeEnum } from '@pe/message-kit';

import { EventOriginEnum } from '../../../enums';
import {
  ChatMessageService,
  AbstractChatMessage,
  ChatTextMessageDocument,
  ChatBoxMessageDocument,
  ChatTemplateMessageDocument,
  AbstractMessagingDocument,
} from '../../platform';
import { AppChannelService } from '../../messaging/app-channels';
import { GroupChatService } from '../../messaging/group-chats';
import {
  ChatTemplateDocument,
  ChatMessageTemplate,
  ChatMessageTemplateDocument,
  ChatTemplate,
} from '../schemas';
import { ADMIN_USER_ID } from '../../../../common';
import { resolveTemplatedObject } from '../../../../common/tools';

@Injectable()
export class TemplatesSynchronizationService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly appChannelChatService: AppChannelService,
    private readonly groupChatService: GroupChatService,
    private readonly chatMessageService: ChatMessageService,
  ) { }

  public async syncChatTemplate(
    chatTemplate: ChatTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const allBusinessess: BusinessModel[] = await this.businessService.findAll().exec();
    for (const business of allBusinessess) {
      await this.syncChatTemplateForBusiness(chatTemplate, business, eventSource);
    }
  }

  public async syncChatTemplateForBusiness(
    chatTemplateDocument: ChatTemplateDocument,
    business: BusinessModel,
    eventSource: EventOriginEnum,
  ): Promise<AbstractMessagingDocument> {
    const chatTemplatePrototype: ChatTemplate = chatTemplateDocument.toObject();
    const chatTemplate: ChatTemplate = resolveTemplatedObject(chatTemplatePrototype, {
      business,
    });

    if ( chatTemplate.members ) {
      chatTemplate.members = chatTemplate.members.filter((member : any) => {
       return member.addedBy && member.user && !( member.addedBy === ''
         || member.user === '' );
      });
    }

    if (chatTemplate.type === MessagingTypeEnum.AppChannel) {

      return this.appChannelChatService.updateOrCreate(
        {
          business: business._id,
          template: chatTemplate._id,
        }, {
          description: chatTemplate.description,
          title: chatTemplate.title,
        }, {
          _id: uuid(),
          app: chatTemplate.app,
          business: business._id,
          description: chatTemplate.description,
          expiresAt: null,

          lastMessages: [],
          members: chatTemplate.members || [],
          photo: '',
          salt: uuid(),
          signed: false,
          template: chatTemplate._id,
          title: chatTemplate.title,
          type: MessagingTypeEnum.AppChannel,
        },
        eventSource,
      );
    } else if (chatTemplatePrototype.type === MessagingTypeEnum.Group) {

      return this.groupChatService.updateOrCreate(
        {
          business: business._id,
          template: chatTemplate._id,
        },
        {
          description: chatTemplate.description,
          title: chatTemplate.title,
        },
        {
          _id: uuid(),
          business: business._id,
          description: chatTemplate.description,
          members: chatTemplate.members || [],
          photo: '',
          salt: uuid(),
          subType: chatTemplate.subType,
          template: chatTemplate._id,
          title: chatTemplate.title,
          type: MessagingTypeEnum.Group,
        },
        eventSource,
      );
    } else {
      throw new Error(`Unsupported chat template type ${chatTemplatePrototype.type}`);
    }
  }

  public async syncChatMessageTemplate(
    chatMessageTemplate: ChatMessageTemplateDocument,
    appChannel: AbstractMessagingDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const messagePropsToPickFromTemplate: Array<keyof ChatMessageTemplate> = [
      'action',
      'attachments',
      'components',
      'interactive',
      'sender',
    ];
    const baseUpdateData: UpdateQuery<AbstractChatMessage> = pick(
      chatMessageTemplate.toObject(),
      messagePropsToPickFromTemplate,
    );

    if (chatMessageTemplate.type === 'text') {
      const content: string = await Encryption.encryptWithSalt(
        chatMessageTemplate.content || '', appChannel.salt,
      );
      const updateData: UpdateQuery<ChatTextMessageDocument> = {
        ...(baseUpdateData as any),
        content,
        type: 'text',
      };

      await this.chatMessageService.updateOrCreate({
        chat: appChannel._id,
        template: chatMessageTemplate._id,
      }, updateData, {
        attachments: [],
        sender: ADMIN_USER_ID,

        ...updateData,

        _id: uuid(),
        chat: appChannel._id,
        data: { },
        sentAt: new Date(),
        template: chatMessageTemplate._id,
        type: 'text',
      }, eventSource);
    } else if (chatMessageTemplate.type === 'box') {
      const interactiveUpdateData: UpdateQuery<AbstractChatMessage> =
        mapKeys(
          omit(
            chatMessageTemplate.interactive?.toObject(),
            ['marked'],
          ),
          (value: any, key: string) => `interactive.${key}`,
        );
      const updateData: UpdateQuery<ChatBoxMessageDocument> = {
        ...(omit(baseUpdateData, ['interactive']) as any),
        ...interactiveUpdateData,
      };
      await this.chatMessageService.updateOrCreate({
        chat: appChannel._id,
        template: chatMessageTemplate._id,
      }, updateData, {
        ...updateData,
        _id: uuid(),
        chat: appChannel._id,
        sentAt: new Date(),
        template: chatMessageTemplate._id,
        type: 'box',
      }, eventSource);
    } else if (chatMessageTemplate.type === 'template') {
      const updateData: UpdateQuery<ChatTemplateMessageDocument> = {
        ...(baseUpdateData as any),
        type: 'template',
      };
      await this.chatMessageService.updateOrCreate({
        chat: appChannel._id,
        template: chatMessageTemplate._id,
      }, updateData, {
        components: [],
        ...updateData,
        _id: uuid(),
        chat: appChannel._id,
        sentAt: new Date(),
        template: chatMessageTemplate._id,
        type: 'template',
      }, eventSource);
    }
  }
}
