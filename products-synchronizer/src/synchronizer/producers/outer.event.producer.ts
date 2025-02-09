import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { StockChangedDto, StockSyncDto } from '../dto';
import { SynchronizeEventEnum } from '../enums';
import { SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { ProductDto } from '../dto/products';
import { MessageBusExchangesEnum, MessageBusRoutingKeys } from '../../environments/rabbit.enum';

/**
 * This producer firing events about changes from outer integrations to Payever services.
 * Also it fires events to inner services using Message bus.
 */
@Injectable()
export class OuterEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async triggerOutwardProductsSynchronize(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
  ): Promise<void> {
    const payload: { } = {
      business: {
        id: synchronization.businessId,
      },
      payload: { },
      synchronization: {
        taskId: task.id,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENDING "${SynchronizeEventEnum.PRODUCTS}" event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: SynchronizeEventEnum.PRODUCTS,
        exchange: 'async_events',
      },
      {
        name: SynchronizeEventEnum.PRODUCTS,
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENT "${SynchronizeEventEnum.PRODUCTS}" event`,
      payload,
    });
  }

  public async sendInwardSyncStarted(
    synchronization: SynchronizationModel,
    task: SynchronizationTaskModel,
  ): Promise<void> {
    const payload: { } = {
      business: {
        id: synchronization.businessId,
      },
      payload: { },
      synchronization: {
        taskId: task.id,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENDING "${SynchronizeEventEnum.InwardSyncStarted}" event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: SynchronizeEventEnum.InwardSyncStarted,
        exchange: 'async_events',
      },
      {
        name: SynchronizeEventEnum.InwardSyncStarted,
        payload,
      },
    );
  }

  public async sendOuterProductCreated(
    businessId: string,
    dto: ProductDto | ProductDto[],
    synchronizationTask: SynchronizationTaskModel | null,
  ): Promise<void> {
    const payload: { } = {
      business: {
        id: businessId,
      },
      payload: {
        ...dto,
      },
      synchronizationTask: {
        id: synchronizationTask ? synchronizationTask.id : null,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENDING "synchronizer.event.outer-product.created" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.outer-product.created',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.outer-product.created',
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENT "synchronizer.event.outer-product.created" event',
      payload,
    });
  }

  public async sendOuterProductUpdated(
    businessId: string,
    dto: ProductDto | ProductDto[],
    synchronizationTask: SynchronizationTaskModel | null,
  ): Promise<void> {
    const payload: { } = {
      business: { id: businessId },
      payload: {
        ...dto,
      },
      synchronizationTask: {
        id: synchronizationTask ? synchronizationTask.id : null,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENDING "synchronizer.event.outer-product.updated" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.outer-product.updated',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.outer-product.updated',
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENT "synchronizer.event.outer-product.updated" event',
      payload,
    });
  }

  public async sendOuterProductUpserted(
    businessId: string,
    dto: ProductDto | ProductDto[],
    synchronizationTask: SynchronizationTaskModel | null,
    isFinished: boolean,
  ): Promise<void> {
    const payload: { } = {
      business: { id: businessId },
      payload: dto,
      synchronization: {
        taskId: synchronizationTask ? synchronizationTask.id : null,
        isFinished,
      },
    };
    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENDING "synchronizer.event.outer-products.upserted.static" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: SynchronizeEventEnum.BULK_PRODUCT_STATIC,
        exchange: MessageBusExchangesEnum.asyncEvents,
      },
      {
        name: SynchronizeEventEnum.BULK_PRODUCT_STATIC,
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENT "synchronizer.event.outer-products.upserted.static" event',
      payload,
    });
  }

  // tslint:disable-next-line: no-identical-functions
  public async sendOuterProductRemoved(
    businessId: string,
    dto: any,
  ): Promise<void> {
    const payload: { } = {
      business: {
        id: businessId,
      },
      payload: {
        ...dto,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENDING "synchronizer.event.outer-product.removed" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.outer-product.removed',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.outer-product.removed',
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENT "synchronizer.event.outer-product.removed" event',
      payload,
    });
  }

  public async triggerOutwardInventorySynchronize(
    synchronization: SynchronizationModel,
  ): Promise<void> {
    const payload: { } = {
      business: {
        id: synchronization.businessId,
      },
      payload: { },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENDING "${SynchronizeEventEnum.INVENTORY}" event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: SynchronizeEventEnum.INVENTORY,
        exchange: 'async_events',
      },
      {
        name: SynchronizeEventEnum.INVENTORY,
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENT "${SynchronizeEventEnum.INVENTORY}" event`,
      payload,
    });
  }

  public async sendOuterStockCreated(payload: StockSyncDto[]): Promise<void> {
    await this.sendOuterStockEvent(payload, 'synchronizer.event.outer-stock.created');
  }

  public async sendOuterStockUpserted(payload: StockSyncDto[]): Promise<void> {
    await this.sendOuterStockEvent(payload, 'synchronizer.event.outer-stock.upserted');
  }

  public async sendOuterStockAdded(
    synchronization: SynchronizationModel,
    dto: StockChangedDto,
  ): Promise<void> {
    await synchronization
      .populate('integration')
      .execPopulate();
    const payload: StockChangedDto = {
      business: {
        id: synchronization.businessId,
      },
      quantity: dto.quantity,
      sku: dto.sku,
      stock: dto.stock,
    };
    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENDING "synchronizer.event.outer-stock.added" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.outer-stock.added',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.outer-stock.added',
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENT "synchronizer.event.outer-stock.added" event',
      payload,
    });
  }

  public async sendOuterStockSubtracted(
    synchronization: SynchronizationModel,
    dto: StockChangedDto,
  ): Promise<void> {
    await synchronization
      .populate('integration')
      .execPopulate();
    const payload: { } = {
      business: {
        id: synchronization.businessId,
      },
      quantity: dto.quantity,
      sku: dto.sku,
      stock: dto.stock,
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENDING "synchronizer.event.outer-stock.subtracted" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'synchronizer.event.outer-stock.subtracted',
        exchange: 'async_events',
      },
      {
        name: 'synchronizer.event.outer-stock.subtracted',
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: 'SENT "synchronizer.event.outer-stock.subtracted" event',
      payload,
    });
  }

  private async sendOuterStockEvent(payload: StockSyncDto[], eventName: string): Promise<void> {
    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENDING ${eventName} event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENT ${eventName} event`,
      payload,
    });
  }
}
