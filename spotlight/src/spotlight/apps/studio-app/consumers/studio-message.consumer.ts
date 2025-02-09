import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightService } from '../../../services';
import { AppEnum } from '../../../enums';
import { SpotlightInterface } from '../../../interfaces';
import { StudioRabbitMessagesEnum } from '../enums';
import { BusinessMediaEventDto } from '../dto/business-media-event.dto';

@Controller()
export class StudioMessageConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: StudioRabbitMessagesEnum.BusinessMediaCreated,
  })
  public async onBusinessMediaCreatedEvent(data: BusinessMediaEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: StudioRabbitMessagesEnum.BusinessMediaUpdated,
  })
  public async onBusinessMediaUpdatedEvent(data: BusinessMediaEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: StudioRabbitMessagesEnum.BusinessMediaDeleted,
  })
  public async onTransactionDeleted(data: BusinessMediaEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: BusinessMediaEventDto, index: boolean = true): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.productToSpotlightDocument(data),
      data.id,
      index,
    );
  }

  private productToSpotlightDocument(data: BusinessMediaEventDto): SpotlightInterface {
    return {
      app: AppEnum.Studio,
      businessId: data.business?.id,
      description: data.mediaType,
      icon: '',
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
