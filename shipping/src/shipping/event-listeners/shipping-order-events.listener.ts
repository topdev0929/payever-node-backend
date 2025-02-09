import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ShippingOrderEventsEnum } from '../enums';
import { ShippingOrderModel } from '../models';
import { ShippingOrderEventsProducer } from '../producer';
import { ShippingOrderElasticService } from '../services';

@Injectable()
export class ShippingOrderEventsListener {
  constructor(
    private readonly shippingOrderEventProducer: ShippingOrderEventsProducer,
    private readonly shippingOrderElasticService: ShippingOrderElasticService,
  ) { }

  @EventListener(ShippingOrderEventsEnum.ShippingOrderCreated)
  public async onShippingOrderCreated(
    shippingOrderModel: ShippingOrderModel,
  ): Promise<void> {
    await this.shippingOrderEventProducer.produceOrderCreatedEvent(shippingOrderModel);
    await this.shippingOrderElasticService.saveIndex(shippingOrderModel);
  }

  @EventListener(ShippingOrderEventsEnum.ShippingOrderUpdated)
  public async onShippingOrderUpdated(
    shippingOrderModel: ShippingOrderModel,
  ): Promise<void> {
    await this.shippingOrderEventProducer.produceOrderUpdatedEvent(shippingOrderModel);
    await this.shippingOrderElasticService.saveIndex(shippingOrderModel);
  }

  @EventListener(ShippingOrderEventsEnum.ShippingOrderRemoved)
  public async onShippingOrderRemoved(
    shippingOrderModel: ShippingOrderModel,
  ): Promise<void> {
    await this.shippingOrderEventProducer.produceOrderRemovedEvent(shippingOrderModel);
    await this.shippingOrderElasticService.deleteIndex(shippingOrderModel);
  }

   @EventListener(ShippingOrderEventsEnum.ShippingOrderProcessed)
  public async onShippingOrderProcessed(
    shippingOrderModel: ShippingOrderModel,
  ): Promise<void> {
    await this.shippingOrderEventProducer.produceOrderProcessedEvent(shippingOrderModel);
    await this.shippingOrderElasticService.saveIndex(shippingOrderModel);
  }

}
