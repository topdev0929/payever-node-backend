import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { AffiliateRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { AffiliateEventDto } from '../dto';

@Controller()
export class AffiliateMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AffiliateRabbitEventsEnum.AffiliateCreated,
  })
  public async onAffiliateCreated(data: AffiliateEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AffiliateRabbitEventsEnum.AffiliateUpdated,
  })
  public async onAffiliateUpdated(data: AffiliateEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AffiliateRabbitEventsEnum.AffiliateExported,
  })
  public async onAffiliateExport(data: AffiliateEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AffiliateRabbitEventsEnum.AffiliateRemoved,
  })
  public async onAffiliateDeleted(data: AffiliateEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: AffiliateEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.affiliateToSpotlightDocument(data), 
      data.id,
    );
  } 

  private affiliateToSpotlightDocument(data: AffiliateEventDto): SpotlightInterface {

    return {
      app: AppEnum.Affiliate,
      businessId: data.business.id,
      description: data.url,
      icon: null,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
