import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitChannelEnum } from '../../environments';
import {
  InventoryEventInventorySynchronizationFailedDto,
  InventoryEventInventorySynchronizationSucceededDto, InventoryEventOrderCreatedDto, InventoryEventStockAddedDto,
  InventoryEventStockSubtractedDto,
} from '../dto';
import { InventoryEventStockSynchronizeDto } from '../dto/inventory-rabbit-messages';
import { ImportedItemTypesEnum } from '../enums';
import { InnerProcessService, SynchronizationTaskService, SynchronizationTriggerService } from '../services';

@Controller()
export class InventoryBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly processService: InnerProcessService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly synchronizationTriggerService: SynchronizationTriggerService,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'inventory.event.stock.added',
  })
  public async innerStockAdded(dto: InventoryEventStockAddedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    return this.processService.processInnerStockAddedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'inventory.event.order.created',
  })
  public async innerOrderCreated(dto: InventoryEventOrderCreatedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    return this.processService.processInnerOrderCreatedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'inventory.event.stock.subtracted',
  })
  public async innerStockSubtracted(dto: InventoryEventStockSubtractedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    return this.processService.processInnerStockSubtractedEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'inventory.event.stock.synchronize',
  })
  public async innerStockSynchronize(dto: InventoryEventStockSynchronizeDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    return this.processService.processInnerStockSynchronizeEvent(business, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'inventory.event.inventory-synchronization.succeeded',
  })
  public async onSyncSucceeded(dto: InventoryEventInventorySynchronizationSucceededDto): Promise<void> {
    await this.synchronizationTaskService.processItem(
      dto.synchronizationTask.id,
      dto.inventory.sku,
      ImportedItemTypesEnum.Inventory,
    );
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'inventory.event.inventory-synchronization.failed',
  })
  public async onSyncFailed(dto: InventoryEventInventorySynchronizationFailedDto): Promise<void> {
    await this.synchronizationTaskService.processItem(
      dto.synchronizationTask.id,
      dto.inventory.sku,
      ImportedItemTypesEnum.Inventory,
      dto.errorMessage,
    );
  }
}
