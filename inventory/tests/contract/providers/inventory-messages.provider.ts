import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { BusinessModel } from '../../../src/business/models';
import { RabbitEventsEnum } from '../../../src/inventory/enums';
import { InventoryModel, OrderModel } from '../../../src/inventory/models';
import { EventProducer } from '../../../src/inventory/producer/event.producer';

@Injectable()
export class InventoryMessagesProvider extends AbstractMessageMock {
  private readonly businessId: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  @PactRabbitMqMessageProvider('inventory.event.stock.added')
  public async mockStockAddedMessage(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(
      EventProducer
    );
    await producer.sendStockAdded(
      { id: this.businessId } as BusinessModel,
      { sku: 'test_sku', stock: 10 } as InventoryModel,
      10
    );
  }

  @PactRabbitMqMessageProvider('inventory.event.order.created')
  public async mockOrderCreatedMessage(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(
      EventProducer
    );
    await producer.sendOrderCreated(
      { id: this.businessId } as BusinessModel,
      {
        business: { id: this.businessId },
        reservations: { },
      } as OrderModel
    );
  }

  @PactRabbitMqMessageProvider('inventory.event.stock.subtracted')
  public async mockStockSubtractedMessage(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(
      EventProducer
    );
    await producer.sendStockSubtracted(
      { id: this.businessId } as BusinessModel,
      { sku: 'test_sku', stock: 10 } as InventoryModel,
      10
    );
  }

  @PactRabbitMqMessageProvider('inventory.event.stock.synchronize')
  public async mockStockSynchronizeMessage(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(
      EventProducer
    );
    await producer.sendStockSynchronize(
      { id: this.businessId } as BusinessModel,
      { sku: 'test_sku', stock: 10 } as InventoryModel
    );
  }

  @PactRabbitMqMessageProvider(
    RabbitEventsEnum.InventorySynchronizationSucceeded
  )
  public async mockSynchronizationSucceeded(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(
      EventProducer
    );
    await producer.synchronizationSucceeded(
      'test_sku',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    );
  }

  @PactRabbitMqMessageProvider(RabbitEventsEnum.InventorySynchronizationFailed)
  public async mockSynchronizationFailed(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(
      EventProducer
    );
    await producer.synchronizationFailed(
      'test_sku',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'Some Error Message'
    );
  }
}
