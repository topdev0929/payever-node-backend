import { Injectable } from '@nestjs/common';
import { AccessConfigService } from '../services';
import { EventListener } from '@pe/nest-kit';
import { AffiliateBrandingModel } from '../models';
import { AffiliateBrandingEventsEnum } from '../enums/affiliate-branding-events.enum';
import { AffiliatesMessagesProducer } from '../producers';
import { AffiliatesRabbitMessagesEnum } from '../enums';

@Injectable()
export class AffiliateBrandingEventsListener {
  constructor(
    private readonly accessConfigService: AccessConfigService,
    private readonly affiliatesMessagesProducer: AffiliatesMessagesProducer,
  ) { }

  @EventListener(AffiliateBrandingEventsEnum.AffiliateBrandingCreated)
  public async onAffiliateBrandingCreated(
    data: AffiliateBrandingModel,
  ): Promise<void> {
    await this.accessConfigService.createOrUpdate(
      data,
      {
        isLive: false,
      },
    );

    await this.affiliatesMessagesProducer.sendAffiliateBrandingMessage(
      AffiliatesRabbitMessagesEnum.AffiliateBrandingCreated, 
      data,
    );
  }

  @EventListener(AffiliateBrandingEventsEnum.AffiliateBrandingUpdated)
  public async onAffiliateBrandingUpdated(
    data: AffiliateBrandingModel,
  ): Promise<void> {
    await this.affiliatesMessagesProducer.sendAffiliateBrandingMessage(
      AffiliatesRabbitMessagesEnum.AffiliateBrandingUpdated, 
      data,
    );
  }

  @EventListener(AffiliateBrandingEventsEnum.AffiliateBrandingRemoved)
  public async onAffiliateBrandingRemoved(
    data: AffiliateBrandingModel,
  ): Promise<void> {
    await this.affiliatesMessagesProducer.sendAffiliateBrandingMessage(
      AffiliatesRabbitMessagesEnum.AffiliateBrandingRemoved, 
      data,
    );
  }
}
