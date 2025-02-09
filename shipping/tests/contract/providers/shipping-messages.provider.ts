import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';
import { ShippingOrderEventsProducer } from '../../../src/shipping/producer';
import { ShippingOrderModel } from '../../../src/shipping/models';

@Injectable()
export class ShippingMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(RabbitEventNameEnum.ShippingOrderProcessed)
  public async mockShippingOrderProcessed(): Promise<void> {
    const producer: ShippingOrderEventsProducer =
      await this.getProvider<ShippingOrderEventsProducer>(ShippingOrderEventsProducer);

    const shippingOrderStub: any = {
      trackingId: '1234647',
      trackingUrl: 'http://tracking.url/path?query=value',
      transactionId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    };

    await producer.produceOrderProcessedEvent(
      shippingOrderStub as ShippingOrderModel,
    );
  }

  @PactRabbitMqMessageProvider(RabbitEventNameEnum.ShippingSlipDownloaded)
  public async mockShippingSlipDownloaded(): Promise<void> {
    const producer: ShippingOrderEventsProducer =
      await this.getProvider<ShippingOrderEventsProducer>(ShippingOrderEventsProducer);
    await producer.produceSlipDownloadedEvent(
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      } as ShippingOrderModel,
    );
  }

  @PactRabbitMqMessageProvider(RabbitEventNameEnum.ShippingLabelDownloaded)
  public async mockShippingLabelDownloaded(): Promise<void> {
    const producer: ShippingOrderEventsProducer =
      await this.getProvider<ShippingOrderEventsProducer>(ShippingOrderEventsProducer);
    await producer.produceLabelDownloadedEvent(
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      } as ShippingOrderModel,
    );
  }
}
