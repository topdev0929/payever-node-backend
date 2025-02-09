import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { ShopRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { ShopEventDto } from '../dto';

@Controller()
export class ShopMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShopRabbitEventsEnum.ShopCreated,
  })
  public async onShopCreated(data: ShopEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShopRabbitEventsEnum.ShopUpdated,
  })
  public async onShopUpdated(data: ShopEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShopRabbitEventsEnum.ShopExported,
  })
  public async onShopExport(data: ShopEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ShopRabbitEventsEnum.ShopRemoved,
  })
  public async onShopDeleted(data: ShopEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: ShopEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.shopToSpotlightDocument(data), 
      data.id,
    );
  } 

  private shopToSpotlightDocument(data: ShopEventDto): SpotlightInterface {

    return {
      app: AppEnum.Shop,
      businessId: data.business.id,
      description: data.domain,
      icon: data.logo,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
