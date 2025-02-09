import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { ShippingProfileRabbitEventsEnum } from '../enums';
import { AppEnum, AppSubTypeEnum } from '../../../enums';
import { ShippingProfileEventDto } from '../dto';

@Controller()
export class ShippingProfileMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileCreated,
  })
  public async onShippingProfileCreated(data: ShippingProfileEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileUpdated,
  })
  public async onShippingProfileUpdated(data: ShippingProfileEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileExported,
  })
  public async onShippingProfileExport(data: ShippingProfileEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data, false);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileRemoved,
  })
  public async onShippingProfileDeleted(data: ShippingProfileEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: ShippingProfileEventDto, index: boolean = true): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.shippingProfileToSpotlightDocument(data), 
      data.id,
      index,
    );
  } 

  private shippingProfileToSpotlightDocument(data: ShippingProfileEventDto): SpotlightInterface {

    return {
      app: AppEnum.Shipping,
      businessId: data.businessId,
      description: `${data.zones?.length || 0}`,
      icon: null,
      serviceEntityId: data.id,
      subType: AppSubTypeEnum.ShippingProfiles,
      title: data.name,
    };
  }
}
