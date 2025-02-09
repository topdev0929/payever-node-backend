import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { OuterEventProducer } from '../../../src/synchronizer/producers';
import { SynchronizationModel } from '@pe/synchronizer-kit';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class SynchronizerInventoryMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider('synchronizer.event.inventory.synchronize')
  public async mockInventorySynchronize(): Promise<void> {

    const synchronizationMock: SynchronizationModel = {
      business: {
        id: BUSINESS_ID,
      },
      populate: mockPopulate,
    } as SynchronizationModel;

    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.triggerOutwardInventorySynchronize(synchronizationMock);
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-stock.created no synchronization task')
  public async mockOuterStockCreatedNoSynchronizationTask(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterStockCreated({
      business: {
        id: BUSINESS_ID,
      },
      businessId: BUSINESS_ID,
      sku: 'test_sku',
      stock: 10,
    });
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-stock.created with synchronization task')
  public async mockOuterStockCreatedWithSynchronizationTask(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterStockCreated({
      business: {
        id: BUSINESS_ID,
      },
      businessId: BUSINESS_ID,
      sku: 'test_sku',
      stock: 10,
      synchronizationTask: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      },
    });
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-stock.added')
  public async mockOuterStockAdded(): Promise<void> {

    const synchronizationMock: SynchronizationModel = {
      business: {
        id: BUSINESS_ID,
      },
      populate: mockPopulate,
    } as SynchronizationModel;

    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterStockAdded(
      synchronizationMock,
      {
        business: {
          id: BUSINESS_ID,
        },
        quantity: 10,
        sku: 'test_sku',
        stock: 10,
      },
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-stock.subtracted')
  public async mockOuterStockSubtracted(): Promise<void> {

    const synchronizationMock: SynchronizationModel = {
      business: {
        id: BUSINESS_ID,
      },
      populate: mockPopulate,
    } as SynchronizationModel;

    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterStockSubtracted(
      synchronizationMock,
      {
        business: {
          id: BUSINESS_ID,
        },
        quantity: 10,
        sku: 'test_sku',
        stock: 10,
      },
    );
  }
}

const mockPopulate: any = (): any => {
  return {
    execPopulate: (): void => {
      return null;
    },
    populate: mockPopulate,
  }
};
