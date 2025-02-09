import { Injectable, Logger } from '@nestjs/common';
import { BusinessModel } from '@pe/business-kit';
import {
  InventoryEventStockAddedDto,
  InventoryEventStockSubtractedDto,
  InventoryEventOrderCreatedDto,
} from '../dto';
import { SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { InnerEventProducer } from '../producers';
import { SynchronizationTaskService } from './synchronization-task.service';
import { SynchronizationService } from './synchronization.service';
import { InventoryEventStockSynchronizeDto } from '../dto/inventory-rabbit-messages';

@Injectable()
export class InnerProcessService {
  constructor(
    private readonly logger: Logger,
    private readonly synchronizationService: SynchronizationService,
    private readonly eventProducer: InnerEventProducer,
    private readonly synchronizationTaskService: SynchronizationTaskService,
  ) { }

  public async processInnerStockAddedEvent(
    business: BusinessModel,
    dto: InventoryEventStockAddedDto,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessIntegrationsWithInventorySync(
        business,
      );

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerStockAdded(synchronization, null, dto);
    }
  }

  public async processInnerOrderCreatedEvent(
    business: BusinessModel,
    dto: InventoryEventOrderCreatedDto,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessIntegrationsWithInventorySync(
        business,
      );

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerOrderCreated(synchronization, null, dto);
    }
  }

  public async processInnerStockSubtractedEvent(
    business: BusinessModel,
    dto: InventoryEventStockSubtractedDto,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessIntegrationsWithInventorySync(
        business,
      );

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerStockSubtracted(
        synchronization,
        null,
        dto,
      );
    }
  }

  public async processInnerStockSynchronizeEvent(
    business: BusinessModel,
    dto: InventoryEventStockSynchronizeDto,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessIntegrationsWithInventorySync(
        business,
      );

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerStockSynchronize(
        synchronization,
        null,
        dto,
      );
    }
  }

  public async processInnerProductCreatedEvent(
    business: BusinessModel,
    payload: any,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );

    const syncTaskId: string = payload.synchronization
      ? payload.synchronization.taskId
      : null;
    const syncTask: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.getOne(syncTaskId)
      : null;

    if (syncTaskId) {
      await this.synchronizationTaskService.productSynchronized({
        itemId: payload.uuid,
        synchronization: payload.synchronization,
      });
    }

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerProductCreated(
        synchronization,
        syncTask,
        payload,
      );
    }
  }

  public async processInnerProductUpdatedEvent(
    business: BusinessModel,
    payload: any,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );

    const syncTaskId: string = payload.synchronization
      ? payload.synchronization.taskId
      : null;
    const syncTask: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.getOne(syncTaskId)
      : null;

    if (syncTaskId) {
      await this.synchronizationTaskService.productSynchronized({
        itemId: payload.uuid,
        synchronization: payload.synchronization,
      });
    }

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerProductUpdated(
        synchronization,
        syncTask,
        payload,
      );
    }
  }

  public async processInnerProductRemovedEvent(
    business: BusinessModel,
    payload: any,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );

    const syncTaskId: string = payload.synchronization
      ? payload.synchronization.taskId
      : null;
    const syncTask: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.getOne(syncTaskId)
      : null;

    if (syncTaskId) {
      await this.synchronizationTaskService.productSynchronized({
        itemId: payload.uuid,
        synchronization: payload.synchronization,
      });
    }

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerProductRemoved(
        synchronization,
        syncTask,
        payload,
      );
    }
  }

  public async processInnerProductsCollectionCreatedEvent(
    business: BusinessModel,
    payload: any,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );
    const syncTaskId: string = payload.synchronization
      ? payload.synchronization.taskId
      : null;
    const syncTask: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.getOne(syncTaskId)
      : null;

    if (syncTaskId) {
      await this.synchronizationTaskService.productsCollectionSynchronized({
        itemId: payload.uuid,
        synchronization: payload.synchronization,
      });
    }

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerProductsCollectionCreated(
        synchronization,
        syncTask,
        payload,
      );
    }
  }

  public async processInnerProductsCollectionUpdatedEvent(
    business: BusinessModel,
    payload: any,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );

    const syncTaskId: string = payload.synchronization
      ? payload.synchronization.taskId
      : null;
    const syncTask: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.getOne(syncTaskId)
      : null;

    if (syncTaskId) {
      await this.synchronizationTaskService.productsCollectionSynchronized({
        itemId: payload.uuid,
        synchronization: payload.synchronization,
      });
    }

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerProductsCollectionUpdated(
        synchronization,
        syncTask,
        payload,
      );
    }
  }

  public async processInnerProductsCollectionRemovedEvent(
    business: BusinessModel,
    payload: any,
  ): Promise<void> {
    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );

    const syncTaskId: string = payload.synchronization
      ? payload.synchronization.taskId
      : null;
    const syncTask: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.getOne(syncTaskId)
      : null;

    if (syncTaskId) {
      await this.synchronizationTaskService.productsCollectionSynchronized({
        itemId: payload.uuid,
        synchronization: payload.synchronization,
      });
    }

    for (const synchronization of synchronizations) {
      await this.eventProducer.sendInnerProductsCollectionRemoved(
        synchronization,
        syncTask,
        payload,
      );
    }
  }

  public async processSynchronizationFinished(payload: any): Promise<void> {
    const syncTaskId: string = payload.taskId;

    await this.synchronizationTaskService.productSynchronizedFinished(syncTaskId);
  }
}
