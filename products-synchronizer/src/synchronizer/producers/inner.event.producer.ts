import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { IntegrationModel, SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { environment } from '../../environments';
import {
  InventoryEventOrderCreatedDto,
  InventoryEventStockAddedDto,
  InventoryEventStockSubtractedDto,
  InventoryEventStockSynchronizeDto,
} from '../dto';
import { FileImportTriggeredEventDto } from '../dto/file-import-triggered-event.dto';
import { ThirdPartyActionEnum } from '../enums';


/**
 * This producer firing events about changes from Payever services to outer integrations.
 * Also it calls actions of outer integrations using ThirdParty service.
 */
@Injectable()
export class InnerEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async emitFileImportTriggeredEvent(task: SynchronizationTaskModel): Promise<void> {
    await task.populate('fileImport').execPopulate();

    const payload: FileImportTriggeredEventDto = {
      business: {
        id: task.businessId,
      },
      fileImport: task.fileImport,
      synchronization: {
        taskId: task.id,
      },
    };

    this.logger.log({
      context: 'InnerEventProducer',
      message: 'SENDING "synchronizer.event.import-file-triggered" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.file-import.triggered',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.file-import.triggered',
        payload,
      },
    );

    this.logger.log('sent');
  }

  public async callIntegrationAction(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    action: ThirdPartyActionEnum,
    data: any = { },
  ): Promise<void> {
    await synchronization
      .populate('integration')
      .execPopulate();
    const integration: IntegrationModel = synchronization.integration as IntegrationModel;

    const payload: any = {
      business: {
        id: synchronization.businessId,
      },
      integration: {
        name: integration.name,
      },
      action,
      data: {
        synchronization: task ? { taskId: task.id } : undefined,
        routingKey: environment.routingKey || '1',
        ...data,
      },
    };

    this.logger.log({
      context: 'InnerEventProducer',
      message: 'SENDING "synchronizer.event.action.call" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.action.call',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.action.call',
        payload,
      },
    );

    this.logger.log({
      context: 'InnerEventProducer',
      message: 'SENT "synchronizer.event.action.call" event',
      payload,
    });
  }

  public async triggerInwardProductsSynchronize(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.SyncProducts,
    );
  }

  public async sendInnerProductCreated(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    payload: any,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.CreateProduct,
      payload,
    );
  }

  public async sendInnerProductUpdated(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    payload: any,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.UpdateProduct,
      payload,
    );
  }

  public async sendInnerProductRemoved(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    payload: any,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.RemoveProduct,
      payload,
    );
  }

  public async sendInnerProductsCollectionCreated(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    payload: any,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.CreateCollection,
      payload,
    );
  }

  public async sendInnerProductsCollectionUpdated(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    payload: any,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.UpdateCollection,
      payload,
    );
  }

  public async sendInnerProductsCollectionRemoved(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    payload: any,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.RemoveCollection,
      payload,
    );
  }

  public async triggerInwardInventorySynchronize(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.SyncInventory,
    );
  }

  public async sendInnerStockAdded(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    dto: InventoryEventStockAddedDto,
  ): Promise<void> {
    const payload: { } = {
      quantity: dto.quantity,
      sku: dto.sku,
      stock: dto.stock,
    };

    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.AddInventory,
      payload,
    );
  }

  public async sendInnerOrderCreated(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    dto: InventoryEventOrderCreatedDto,
  ): Promise<void> {
    const payload: { } = {
      ...dto.order,
    };

    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.OrderCreated,
      payload,
    );
  }

  public async sendInnerStockSubtracted(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    dto: InventoryEventStockSubtractedDto,
  ): Promise<void> {
    const payload: { } = {
      quantity: dto.quantity,
      sku: dto.sku,
      stock: dto.stock,
    };

    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.SubtractInventory,
      payload,
    );
  }

  public async sendInnerStockSynchronize(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
    dto: InventoryEventStockSynchronizeDto,
  ): Promise<void> {
    const payload: { } = {
      sku: dto.sku,
      stock: dto.stock,
    };

    return this.callIntegrationAction(
      synchronization,
      task,
      ThirdPartyActionEnum.SetInventory,
      payload,
    );
  }
}
