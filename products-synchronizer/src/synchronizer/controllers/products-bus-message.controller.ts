import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { RabbitChannelEnum } from '../../environments';
import { ProductSynchronizationFailedDto, ProductSynchronizationSucceededDto } from '../dto';
import { ImportedItemTypesEnum } from '../enums';
import { ProductInnerEventMessageInterface } from '../interfaces';
import { InnerProcessService, SynchronizationTaskService } from '../services';

@Controller()
export class ProductsBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly processService: InnerProcessService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'products.event.product.created',
  })
  public async syncOnProductCreated(dto: ProductInnerEventMessageInterface): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.businessUuid,
    );

    if (!business) {
      this.logger.warn(
        `received event with businessId = ${dto.businessUuid}, but business not found`,
      );

      return;
    }

    await this.processService.processInnerProductCreatedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'products.event.product.updated',
  })
  public async syncOnProductUpdated(dto: ProductInnerEventMessageInterface): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.businessUuid,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessUuid = ${dto.businessUuid}, but business not found`,
      );

      return;
    }

    await this.processService.processInnerProductUpdatedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'products.event.product.removed',
  })
  public async syncOnProductRemoved(dto: ProductInnerEventMessageInterface): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.businessUuid,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessId = ${dto.businessUuid}, but business not found`,
      );

      return;
    }

    await this.processService.processInnerProductRemovedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'products.event.product-synchronization.finished',
  })
  public async onSyncFinished(dto: { taskId: string; isFinished?: boolean }): Promise<void> {
    await this.processService.processSynchronizationFinished(dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'products.event.product-synchronization.succeeded',
  })
  public async onSyncSucceeded(dto: ProductSynchronizationSucceededDto): Promise<void> {
    await this.synchronizationTaskService.processItem(
      dto.synchronizationTask.id,
      dto.product.sku,
      ImportedItemTypesEnum.Product,
    );
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'products.event.product-synchronization.failed',
  })
  public async onSyncFailed(dto: ProductSynchronizationFailedDto): Promise<void> {
    await this.synchronizationTaskService.processItem(
      dto.synchronizationTask.id,
      dto.product.sku,
      ImportedItemTypesEnum.Product,
      dto.errorMessage,
    );
  }
}
