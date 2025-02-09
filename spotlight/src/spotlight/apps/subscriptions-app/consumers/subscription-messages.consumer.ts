import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { SubscriptionsRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { SubscriptionsEventDto } from '../dto';

@Controller()
export class SubscriptionsMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsCreated,
  })
  public async onSubscriptionsCreated(data: SubscriptionsEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsUpdated,
  })
  public async onSubscriptionsUpdated(data: SubscriptionsEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsExported,
  })
  public async onSubscriptionsExport(data: SubscriptionsEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsRemoved,
  })
  public async onSubscriptionsDeleted(data: SubscriptionsEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: SubscriptionsEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.subscriptionsToSpotlightDocument(data), 
      data.id,
    );
  } 

  private subscriptionsToSpotlightDocument(data: SubscriptionsEventDto): SpotlightInterface {

    return {
      app: AppEnum.Subscriptions,
      businessId: data.business.id,
      description: data.planType,
      icon: null,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
