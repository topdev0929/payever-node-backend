import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import { BusinessModel } from '../../business/models';
import { RabbitEventsEnum } from '../enums';
import { InventoryModel, OrderModel } from '../models';
import { environment } from '../../environments';
import { InventoryService } from '../services';

@Injectable()
export class EventProducer {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async produceSetStockEvent(
    business: BusinessModel,
    inventory: InventoryModel,
    quantity: number,
  ): Promise<void> {
    await this.sendStockEvent(business, inventory, quantity, 'inventory.event.stock.set');
  }

  public async sendStockAdded(
    business: BusinessModel,
    inventory: InventoryModel,
    quantity: number,
  ): Promise<void> {
    await this.sendStockEvent(business, inventory, quantity, 'inventory.event.stock.added');
  }

  public async sendStockSubtracted(
    business: BusinessModel,
    inventory: InventoryModel,
    quantity: number,
  ): Promise<void> {
    await this.sendStockEvent(business, inventory, quantity, 'inventory.event.stock.subtracted');
  }

  public async sendOrderCreated(
    business: BusinessModel,
    order: OrderModel,
  ): Promise<void> {
    await this.sendOrderEvent(business, order, 'inventory.event.order.created');
  }

  public async sendStockSynchronize(
    business: BusinessModel,
    inventory: InventoryModel,
  ): Promise<void> {
    let stock: number = inventory.stock;
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel = await this.inventoryService.findOneByBusinessIdAndSku(
        inventory.originalInventory.businessId,
        inventory.originalInventory.sku,
      );

      stock = originalInventory.stock;
    }

    if (inventory.isNegativeStockAllowed && stock <= 0) {
      stock = 100;
    }

    const payload: { } = {
      business: {
        id: business.id,
      },
      sku: inventory.sku,
      stock: stock,
    };

    this.logger.log({
      context: 'EventProducer',
      message: 'SENDING "inventory.event.stock.synchronize" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'inventory.event.stock.synchronize',
        exchange: 'async_events',
      },
      {
        name: 'inventory.event.stock.synchronize',
        payload,
      },
    );

    this.logger.log({
      context: 'EventProducer',
      message: 'SENT "inventory.event.stock.synchronize" event',
      payload,
    });
  }

  public async synchronizationSucceeded(sku: string, taskId: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitEventsEnum.InventorySynchronizationSucceeded,
        exchange: 'async_events',
      },
      {
        name: RabbitEventsEnum.InventorySynchronizationSucceeded,
        payload: {
          inventory: {
            sku: sku,
          },
          synchronizationTask: {
            id: taskId,
          },
        },
      },
    );
  }

  public async synchronizationFailed(sku: string, taskId: string, errorMessage: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitEventsEnum.InventorySynchronizationFailed,
        exchange: 'async_events',
      },
      {
        name: RabbitEventsEnum.InventorySynchronizationFailed,
        payload: {
          errorMessage,
          inventory: {
            sku: sku,
          },
          synchronizationTask: {
            id: taskId,
          },
        },
      },
    );
  }

  public async sendLowStockWarningIfRequired(
    business: BusinessModel, inventory: InventoryModel,
  ): Promise<void> {
    if (
      business &&
      inventory.emailLowStock &&
      inventory.lowStock &&
      inventory.lowStock > inventory.stock) {
      await this.sendLowStockWarning(business, inventory);
    }
  }

  public async sendLowStockWarning(
    business: BusinessModel,
    inventory: InventoryModel,
  ): Promise<void> {
    await this.sendLowStockWarningMessage(business, inventory);
  }

  private async sendLowStockWarningMessage(
    business: BusinessModel,
    inventory: InventoryModel,
  ): Promise<void> {
    let stock: number = inventory.stock;
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel = await this.inventoryService.findOneByBusinessIdAndSku(
        inventory.originalInventory.businessId,
        inventory.originalInventory.sku,
      );

      stock = originalInventory.stock;
    }

    const payload: { } = {
      businessId: business.id,
      subject: `Your product stock with sku ${inventory.sku} is low.`,
      templateName: 'product_low_stock_automated_email',
      variables: {
        lowStock: inventory.lowStock,
        productsUrl: `${environment.commerceOsUrl}/business/${business.id}/products/list`,
        sku: inventory.sku,
        stock: stock,
      },
    };

    await this.rabbitClient.send(
      {
        channel: 'payever.event.business.email',
        exchange: 'async_events',
      },
      {
        name: 'payever.event.business.email',
        payload,
      },
    );
  }

  private async sendStockEvent(
    business: BusinessModel,
    inventory: InventoryModel,
    quantity: number,
    eventName: string,
  ): Promise<void> {
    let stock: number = inventory.stock;
    if (inventory.originalInventory) {
      const originalInventory: InventoryModel = await this.inventoryService.findOneByBusinessIdAndSku(
        inventory.originalInventory.businessId,
        inventory.originalInventory.sku,
      );

      stock = originalInventory.stock;
    }

    const payload: { } = {
      business: {
        id: business.id,
      },
      quantity: quantity,
      sku: inventory.sku,
      stock: stock,
    };

    this.logger.log({
      context: 'EventProducer',
      message: `SENDING "${eventName}" event`,
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
      context: 'EventProducer',
      message: `SENT "${eventName}" event`,
      payload,
    });
  }

  private async sendOrderEvent(
    business: BusinessModel,
    order: OrderModel,
    eventName: string,
  ): Promise<void> {

    const payload: { } = {
      business: {
        id: business.id,
      },
      order,
    };

    this.logger.log({
      context: 'EventProducer',
      message: `SENDING "${eventName}" event`,
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
      context: 'EventProducer',
      message: `SENT "${eventName}" event`,
      payload,
    });
  }
}
