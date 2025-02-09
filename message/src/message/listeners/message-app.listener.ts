// tslint:disable: object-literal-sort-keys
import { Injectable, Logger } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';

import { EventOriginEnum } from '../enums';
import {
  ChatTemplateDocument,
  ChatMessageTemplateDocument,
  ChatTemplateService,
  ChatMessageTemplateService,
  TemplatesSynchronizationService,
} from '../submodules/templates';
import {
  CommonMessagingService,
  AbstractMessagingDocument,
} from '../submodules/platform';
import {
  AppChannelDocument,
  AppChannel,
} from '../submodules/messaging/app-channels';
import { MerchantChatServerProducer, BuilderProducer } from '../producers';
import { BusinessLocalDocument } from '../../projections/models';

@Injectable()
export class MessageAppListener {
  constructor(
    protected readonly logger: Logger,
    private readonly chatTemplateService: ChatTemplateService,
    private readonly chatMessageTemplateService: ChatMessageTemplateService,
    private readonly merchantChatServerProducer: MerchantChatServerProducer,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly builderProducer: BuilderProducer,
    private readonly templatesSynchronizationService: TemplatesSynchronizationService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(
    business: BusinessLocalDocument,
  ): Promise<void> {
    await this.createOrUpdateChannelsBasedOnTemplates(business);
  }

  @EventListener(BusinessEventsEnum.BusinessUpdated)
  public async onBusinessUpdated(
    business: BusinessLocalDocument,
  ): Promise<void> {
    await this.createOrUpdateChannelsBasedOnTemplates(business);
  }


  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async onBusinessRemoved(
    business: BusinessLocalDocument,
  ): Promise<void> {
    const allMessagings: AbstractMessagingDocument[] = await this.commonMessagingService.find({
      business: business._id,
    });
    for (const messaging of allMessagings) {
      try {
        await this.commonMessagingService.hardDelete(
          messaging._id,
          EventOriginEnum.RabbitMQ,
        );
      } catch (error) {
        this.logger.error({
          error: error.message,
          message: 'Failed to hard delete messaging',
          abstractMessagingId: messaging._id,
        });
      }
    }

    await this.builderProducer.appRemoved(business);
  }

  @EventListener(BusinessEventsEnum.BusinessExport)
  public async onBusinessExported(
    business: BusinessLocalDocument,
  ): Promise<void> {
    await Promise.all([
      this.createOrUpdateChannelsBasedOnTemplates(business),
      this.builderProducer.appExported(business),
    ]);
  }

  private async createOrUpdateChannelsBasedOnTemplates(business: BusinessLocalDocument): Promise<void> {
    const chatTemplates: ChatTemplateDocument[] = await this.chatTemplateService.find({ }).exec();

    const allAppChannels: AppChannelDocument[] = [];

    for (const chatTemplate of chatTemplates) {

      const channel: AbstractMessagingDocument = await this.templatesSynchronizationService.syncChatTemplateForBusiness(
        chatTemplate,
        business,
        EventOriginEnum.RabbitMQ,
      ).catch((ex: any) => null);

      if (!channel) {
        continue;
      }

      if (AppChannel.isTypeOf(channel)) {
        allAppChannels.push(channel);
      }

      const messageTemplates: ChatMessageTemplateDocument[] = await this.chatMessageTemplateService.find({
        chatTemplate: chatTemplate._id,
      }).sort({ order: 1 }).exec();

      for (const messageTemplate of messageTemplates) {
        await this.templatesSynchronizationService.syncChatMessageTemplate(
          messageTemplate,
          channel,
          EventOriginEnum.RabbitMQ,
        );
      }
    }

    await this.merchantChatServerProducer.initialAppChannelsCreated(business._id, allAppChannels);
  }
}
