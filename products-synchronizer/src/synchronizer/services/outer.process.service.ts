import { Injectable, Logger } from '@nestjs/common';
import { BusinessModel } from '@pe/business-kit';
import { IntegrationModel, SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { IntegrationMessageDto, StockChangedDto, StockSyncDto, SynchronizationTaskReferenceDto } from '../dto';
import { ProductImportedDto } from '../dto/product-files-rabbit-messages';
import { ProductDto } from '../dto/products';
import { ThirdPartyInventoryDto, ThirdPartyStockSyncMessageDto } from '../dto/third-party-rabbit-messages';
import { SynchronizationTasKindEnum } from '../enums/synchronization-task-kind.enum';
import { OuterEventProducer } from '../producers';
import { SynchronizationTaskService } from './synchronization-task.service';
import { SynchronizationService } from './synchronization.service';

@Injectable()
export class OuterProcessService {
  constructor(
    private readonly logger: Logger,
    private readonly synchronizationService: SynchronizationService,
    private readonly eventProducer: OuterEventProducer,
    private readonly synchronizationTaskService: SynchronizationTaskService,
  ) { }

  public async processOuterStockCreatedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ThirdPartyStockSyncMessageDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationWithInventorySync(
        business,
        integration,
      );

    if (synchronization) {
      await synchronization
        .populate('business')
        .populate('integration')
        .execPopulate();

      dto.business.id = business.id;

      await this.eventProducer.sendOuterStockCreated(
        (dto.inventories as ThirdPartyInventoryDto[]).map((inventory) => ({
          businessId: dto.business.id,
          business: {
            id: dto.business.id,
          },
          integration: {
            name: dto.integration.name,
          },
          ...inventory,
          origin: integration.name,
        })) as StockSyncDto[]
      );
    }
  }

  public async processOuterStockUpsertedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ThirdPartyStockSyncMessageDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationWithInventorySync(
        business,
        integration,
      );

    if (synchronization) {
      await synchronization
        .populate('business')
        .populate('integration')
        .execPopulate();

      const payload =  {
        businessId: dto.business.id,
        business: {
          id: dto.business.id,
        },
        integration: {
          name: dto.integration.name,
        },
      };
      await this.eventProducer.sendOuterStockUpserted(
        (dto.inventories as ThirdPartyInventoryDto[]).map((inventory) => ({
          ...payload,
          ...inventory,
          origin: integration.name,
        })) as StockSyncDto[],
      );
    }
  }

  public async processOuterStockAddedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: StockChangedDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationWithInventorySync(
        business,
        integration,
      );

    if (synchronization) {
      await this.eventProducer.sendOuterStockAdded(synchronization, dto);
    }
  }

  public async processOuterStockSubtractedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: StockChangedDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationWithInventorySync(
        business,
        integration,
      );

    if (synchronization) {
      await this.eventProducer.sendOuterStockSubtracted(synchronization, dto);
    }
  }

  public async processOuterProductCreatedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    payload: IntegrationMessageDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationInwarding(
        business,
        integration,
      );
    if (!synchronization) {
      return;
    }

    const task: SynchronizationTaskModel = await this.synchronizationTaskService.productSynchronized(
      {
        synchronization: payload.synchronization,
      },
    );

    if (synchronization) {
      await synchronization.populate('business').execPopulate();
      await this.eventProducer.sendOuterProductCreated(
        business.id,
        payload.data,
        task,
      );
    }
  }

  public async processOuterProductUpdatedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    payload: IntegrationMessageDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationInwarding(
        business,
        integration,
      );


    const task: SynchronizationTaskModel = payload.synchronization
      ? await this.synchronizationTaskService.productSynchronized({
          synchronization: payload.synchronization,
        })
      : null;


    if (synchronization) {
      await synchronization.populate('business').execPopulate();
      await this.eventProducer.sendOuterProductUpdated(
        business.id,
        payload.data,
        task,
      );
    }
  }

  public async processOuterProductUpsertedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    payload: IntegrationMessageDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationInwarding(
        business,
        integration,
      );

    if (!synchronization) {
      return;
    }

    const synchronizationTask: SynchronizationTaskModel = await this.synchronizationTaskService.productSynchronized(
      {
        synchronization: payload.synchronization,
      },
      Array.isArray(payload.data) ? payload.data.length : 1,
    );

    await synchronization.populate('business').execPopulate();
    await this.eventProducer.sendOuterProductUpserted(
      business.id,
      payload.data.map(product => ({ ...product, origin: integration.name })),
      synchronizationTask,
      payload.synchronization.isFinished,
    );
  }

  public async processOuterProductRemovedEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    payload: IntegrationMessageDto,
  ): Promise<void> {
    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneBusinessIntegrationInwarding(
        business,
        integration,
      );

    if (payload.synchronization) {
      await this.synchronizationTaskService.productSynchronized({
        synchronization: payload.synchronization,
      });
    }

    if (synchronization) {
      await this.eventProducer.sendOuterProductRemoved(
        business.id,
        payload.data,
      );
    }
  }

  public async processProductImportedEvent(
    dto: ProductImportedDto,
  ): Promise<void> {
    const syncTask: SynchronizationTaskModel = await this.synchronizationTaskService.getOne(
      dto.synchronization.taskId,
    );

    await syncTask
        .populate('business')
        .populate('integration')
        .execPopulate();

    const integration: IntegrationModel = syncTask.integration as IntegrationModel;
    const origin: string = integration?.name;

    if (!syncTask) {
      this.logger.warn({
        dto,
        message: `Product import event: sync task not found. Ignoring...`,
      });
    }

    await syncTask
      .populate('fileImport')
      .execPopulate();

    if (syncTask.fileImport.overwriteExisting === true) {
      await this.eventProducer.sendOuterProductUpserted(
        syncTask.businessId,
        {
          ...dto.data,
          origin,
        },
        syncTask,
        dto.synchronization.isFinished,
      );
    } else {
      await this.eventProducer.sendOuterProductCreated(
        syncTask.businessId,
        {
          ...dto.data,
          origin,
        },
        syncTask,
      );
    }

    const data: ProductDto = dto.data;
    const synchronizationTaskDto: SynchronizationTaskReferenceDto = syncTask ? { id: syncTask.id } : null;

    if (data.inventory) {

      await this.eventProducer.sendOuterStockCreated([{
        barcode: data.barcode,
        business: { id: syncTask.businessId },
        businessId: syncTask.businessId,
        integration: { name: SynchronizationTasKindEnum.FileImport },
        sku: data.inventory.sku,
        stock: data.inventory.stock,
        synchronizationTask: synchronizationTaskDto,
        origin,
      }] as StockSyncDto[]);
    }

    if (Array.isArray(data.variants)) {
      for (const variant of data.variants) {
        if (variant.inventory) {
          await this.eventProducer.sendOuterStockCreated([{
            barcode: variant.barcode,
            business: { id: syncTask.businessId },
            businessId: syncTask.businessId,
            integration: { name: SynchronizationTasKindEnum.FileImport },
            sku: variant.inventory.sku,
            stock: variant.inventory.stock,
            synchronizationTask: synchronizationTaskDto,
            origin,
          }] as StockSyncDto[]);
        }
      }
    }
  }
}
