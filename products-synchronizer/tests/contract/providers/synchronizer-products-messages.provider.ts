import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { OuterEventProducer } from '../../../src/synchronizer/producers';
import { SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { ProductsDtoStub } from '../stubs';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class SynchronizerProductsMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.created minimal message')
  public async mockOuterProductCreatedMinimalData(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductCreated(
      BUSINESS_ID,
      ProductsDtoStub.getMinmalProductData(),
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.created full message')
  public async mockOuterProductCreatedFullData(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductCreated(
      BUSINESS_ID,
      ProductsDtoStub.getFullProductData(),
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.updated minimal message')
  public async mockOuterProductUpdatedMinimalData(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductUpdated(
      BUSINESS_ID,
      ProductsDtoStub.getMinmalProductData(),
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.updated full message')
  public async mockOuterProductUpdatedFullData(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductUpdated(
      BUSINESS_ID,
      ProductsDtoStub.getFullProductData(),
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.upserted minimal message')
  public async mockOuterProductUpsertedMinimalData(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductUpserted(
      BUSINESS_ID,
      ProductsDtoStub.getMinmalProductData(),
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.upserted full message')
  public async mockOuterProductUpsertedFullData(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductUpserted(
      BUSINESS_ID,
      ProductsDtoStub.getFullProductData(),
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.outer-product.removed')
  public async mockOuterProductRemoved(): Promise<void> {
    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.sendOuterProductRemoved(
      BUSINESS_ID,
      {
        sku: 'test_sku',
      },
    );
  }

  @PactRabbitMqMessageProvider('synchronizer.event.products.synchronize')
  public async mockProductsSynchronize(): Promise<void> {
    const synchronizationMock: SynchronizationModel = {
      business: {
        id: BUSINESS_ID,
      },
      populate: mockPopulate,
    } as SynchronizationModel;

    const producer: OuterEventProducer = await this.getProvider<OuterEventProducer>(OuterEventProducer);
    await producer.triggerOutwardProductsSynchronize(
      synchronizationMock,
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' } as SynchronizationTaskModel,
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
