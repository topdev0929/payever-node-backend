import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { ShippingZoneRabbitEventsEnum } from '../enums';
import { AppEnum, AppSubTypeEnum } from '../../../enums';
import { ShippingZoneEventDto } from '../dto';

@Controller()
export class ShippingZoneMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneCreated,
  })
  public async onShippingZoneCreated(data: ShippingZoneEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneUpdated,
  })
  public async onShippingZoneUpdated(data: ShippingZoneEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneExported,
  })
  public async onShippingZoneExport(data: ShippingZoneEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data, false);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneRemoved,
  })
  public async onShippingZoneDeleted(data: ShippingZoneEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: ShippingZoneEventDto, index: boolean = true): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.shippingZoneToSpotlightDocument(data), 
      data.id,
      index,
    );
  } 

  private shippingZoneToSpotlightDocument(data: ShippingZoneEventDto): SpotlightInterface {

    return {
      app: AppEnum.Shipping,
      businessId: data.businessId,
      description: data.countryCodes?.join(', '),
      icon: null,
      serviceEntityId: data.id,
      subType: AppSubTypeEnum.ShippingZones,
      title: data.name,
    };
  }
}
