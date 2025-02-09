import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { RabbitChannelEnum } from '../../environments';
import { ProductsCollectionEventsEnum } from '../enums';
import { CollectionInnerEventMessageInterface } from '../interfaces';
import { InnerProcessService } from '../services';

@Controller()
export class CollectionsBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly processService: InnerProcessService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductsCollectionEventsEnum.ProductsCollectionCreated,
  })
  public async syncOnCollectionCreated(dto: CollectionInnerEventMessageInterface): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.businessUuid,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessId = ${dto.businessUuid}, but business not found`,
      );

      return;
    }
    await this.processService.processInnerProductsCollectionCreatedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductsCollectionEventsEnum.ProductsCollectionUpdated,
  })
  public async syncOnCollectionUpdated(dto: CollectionInnerEventMessageInterface): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.businessUuid,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessUuid = ${dto.businessUuid}, but business not found`,
      );

      return;
    }

    await this.processService.processInnerProductsCollectionUpdatedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductsCollectionEventsEnum.ProductsCollectionRemoved,
  })
  public async syncOnCollectionRemoved(dto: CollectionInnerEventMessageInterface): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.businessUuid,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessId = ${dto.businessUuid}, but business not found`,
      );

      return;
    }

    await this.processService.processInnerProductsCollectionRemovedEvent(business, dto);
  }
}
