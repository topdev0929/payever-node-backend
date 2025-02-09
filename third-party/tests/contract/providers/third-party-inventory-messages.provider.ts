import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { BusinessModel } from '../../../src/business/models';
import { EventProducer } from '../../../src/products/producer';
import { IntegrationModel } from '@pe/third-party-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class ThirdPartyInventoryMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider('third-party.event.stock.created')
  public async mockThirdPartyStockCreated(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterStockCreated(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      {
        stock: 10,
        sku: 'test_sku',
      },
    );
  }

  @PactRabbitMqMessageProvider('third-party.event.stock.added')
  public async mockThirdPartyStockAdded(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterStockAdded(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      {
        stock: 10,
        sku: 'test_sku',
        quantity: 5,
      },
    );
  }

  @PactRabbitMqMessageProvider('third-party.event.stock.subtracted')
  public async mockThirdPartyStockSubtracted(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterStockSubtracted(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      {
        stock: 10,
        sku: 'test_sku',
        quantity: 5,
      },
    );
  }
}
