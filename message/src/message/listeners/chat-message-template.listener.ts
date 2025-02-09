import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { EventOriginEnum } from '../enums';
import { ChatMessageTemplateDocument, TemplatesSynchronizationService } from '../submodules/templates';
import { AbstractMessagingDocument, ChatMessageService, AbstractChatMessageDocument } from '../submodules/platform';
import { AppChannelService, AppChannelDocument } from '../submodules/messaging/app-channels';
import { InternalEventCodesEnum } from '../../common';

@Injectable()
export class ChatMessageTemplateListener {
  constructor(
    private readonly appChannelService: AppChannelService,
    private readonly chatMessageService: ChatMessageService,
    private readonly templatesSynchronizationService: TemplatesSynchronizationService,
  ) { }

  @EventListener(InternalEventCodesEnum.MessageTemplateCreated)
  public async onMessageTemplateCreated(
    chatMessageTemplate: ChatMessageTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.syncTemplateMessages(chatMessageTemplate, eventSource);
  }

  @EventListener(InternalEventCodesEnum.MessageTemplateUpdated)
  public async onMessageTemplateUpdated(
    chatMessageTemplate: ChatMessageTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.syncTemplateMessages(chatMessageTemplate, eventSource);
  }

  @EventListener(InternalEventCodesEnum.MessageTemplateDeleted)
  public async onMessageTemplateDeleted(
    chatMessageTemplate: ChatMessageTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const channels: AbstractMessagingDocument[] = await this.getChannels(chatMessageTemplate);

    for (const channel of channels) {
      const message: AbstractChatMessageDocument = await this.chatMessageService.findOne({
        chat: channel._id,
        template: chatMessageTemplate._id,
      });

      if (message) {
        await this.chatMessageService.delete(message._id, eventSource);
      }
    }
  }

  private async getChannels(chatMessageTemplate: ChatMessageTemplateDocument): Promise<AppChannelDocument[]> {
    return this.appChannelService.find({ template: chatMessageTemplate.chatTemplate });
  }

  private async syncTemplateMessages(
    chatMessageTemplate: ChatMessageTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const channels: AppChannelDocument[] = await this.getChannels(chatMessageTemplate);

    for (const channel of channels) {
      await this.templatesSynchronizationService.syncChatMessageTemplate(
        chatMessageTemplate,
        channel,
        eventSource,
      );
    }
  }
}
