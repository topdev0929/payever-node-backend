import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { SiteRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { SiteEventDto } from '../dto';

@Controller()
export class SiteMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SiteRabbitEventsEnum.SiteCreated,
  })
  public async onSiteCreated(data: SiteEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SiteRabbitEventsEnum.SiteUpdated,
  })
  public async onSiteUpdated(data: SiteEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SiteRabbitEventsEnum.SiteExported,
  })
  public async onSiteExport(data: SiteEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SiteRabbitEventsEnum.SiteRemoved,
  })
  public async onSiteDeleted(data: SiteEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: SiteEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.siteToSpotlightDocument(data), 
      data.id,
    );
  } 

  private siteToSpotlightDocument(data: SiteEventDto): SpotlightInterface {

    return {
      app: AppEnum.Site,
      businessId: data.business.id,
      description: data.domain,
      icon: null,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
