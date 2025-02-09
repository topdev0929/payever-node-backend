import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { BusinessModel, BusinessService } from '@pe/business-kit';
import { EventOriginEnum } from '../enums';
import { InternalEventCodesEnum } from '../../common';
import { ChatTemplateDocument, TemplatesSynchronizationService } from '../submodules/templates';
import {
  AppChannelDocument,
  AppChannelService,
} from '../submodules/messaging/app-channels';
import {
  CommonMessagingService,
} from '../submodules/platform';

@Injectable()
export class ChatTemplateListener {
  constructor(
    private readonly businessService: BusinessService,
    private readonly appChannelChatService: AppChannelService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly templatesSynchronizationService: TemplatesSynchronizationService,
  ) { }

  @EventListener(InternalEventCodesEnum.ChatTemplateCreated)
  public async onChatTemplateCreated(
    chatTemplate: ChatTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.templatesSynchronizationService.syncChatTemplate(chatTemplate, eventSource);
  }

  @EventListener(InternalEventCodesEnum.ChatTemplateUpdated)
  public async onChatTemplateUpdated(
    chatTemplate: ChatTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.templatesSynchronizationService.syncChatTemplate(
      chatTemplate,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.ChatTemplateDeleted)
  public async onChatTemplateDeleted(
    chatTemplate: ChatTemplateDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const businesses: BusinessModel[] = await this.getBusinesses();

    for (const business of businesses) {
      const chat: AppChannelDocument = await this.appChannelChatService.findOne({
        business: business._id,
        template: chatTemplate._id,
      });

      if (chat) {
        await this.commonMessagingService.delete(chat._id, eventSource);
      }
    }
  }

  private async getBusinesses(): Promise<BusinessModel[]> {
    return this.businessService.findAll({ });
  }
}
