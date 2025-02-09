import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { CheckoutRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { CheckoutEventDto } from '../dto';

@Controller()
export class CheckoutMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CheckoutRabbitEventsEnum.CheckoutCreated,
  })
  public async onCheckoutCreated(data: CheckoutEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CheckoutRabbitEventsEnum.CheckoutUpdated,
  })
  public async onCheckoutUpdated(data: CheckoutEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CheckoutRabbitEventsEnum.CheckoutExport,
  })
  public async onCheckoutExport(data: CheckoutEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CheckoutRabbitEventsEnum.CheckoutRemoved,
  })
  public async onCheckoutDeleted(data: CheckoutEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.checkoutId,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: CheckoutEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.checkoutToSpotlightDocument(data), 
      data.checkoutId,
    );
  } 

  private checkoutToSpotlightDocument(data: CheckoutEventDto): SpotlightInterface {

    return {
      app: AppEnum.Checkout,
      businessId: data.businessId,
      description: '',
      icon: '',
      serviceEntityId: data.checkoutId,
      title: data.name,
    };
  }
}
