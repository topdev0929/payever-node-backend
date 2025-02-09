import { RabbitMqClient } from '@pe/nest-kit';
import { ShippingOrderModel } from '../models';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { ShippingOrderProcessedMessageDto } from '../dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingOrderEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async produceOrderProcessedEvent(order: ShippingOrderModel): Promise<void> {
    await this.produceOrderEvent(RabbitEventNameEnum.ShippingOrderProcessed, order);
  }

  public async produceOrderUpdatedEvent(order: ShippingOrderModel): Promise<void> {
    await this.produceOrderEvent(RabbitEventNameEnum.ShippingOrderUpdated, order);
  }

  public async produceOrderExportedEvent(order: ShippingOrderModel): Promise<void> {
    await this.produceOrderEvent(RabbitEventNameEnum.ShippingOrderExported, order);
  }

  public async produceOrderCreatedEvent(order: ShippingOrderModel): Promise<void> {
    await this.produceOrderEvent(RabbitEventNameEnum.ShippingOrderCreated, order);
  }

  public async produceOrderRemovedEvent(order: ShippingOrderModel): Promise<void> {
    await this.produceOrderEvent(RabbitEventNameEnum.ShippingOrderRemoved, order);
  }

  public produceOrderEvent(eventName: RabbitEventNameEnum, order: ShippingOrderModel): Promise<void> {
    const payload: ShippingOrderProcessedMessageDto = {
      business: {
        id: order.businessId,
      },
      id: order._id,
      trackingNumber: order.trackingId,
      trackingUrl: order.trackingUrl,
      transactionId: order.transactionId,
    };

    return this.rabbitMqClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }

  public async produceLabelDownloadedEvent(order: ShippingOrderModel): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: RabbitEventNameEnum.ShippingLabelDownloaded,
        exchange: 'async_events',
      },
      {
        name: RabbitEventNameEnum.ShippingLabelDownloaded,
        payload: {
          shippingOrder: {
            id: order.id,
          },
        },
      },
    );
  }

  public async produceSlipDownloadedEvent(order: ShippingOrderModel): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: RabbitEventNameEnum.ShippingSlipDownloaded,
        exchange: 'async_events',
      },
      {
        name: RabbitEventNameEnum.ShippingSlipDownloaded,
        payload: {
          shippingOrder: {
            id: order.id,
          },
        },
      },
    );
  }
}
