import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { RabbitMqClient, RabbitMqConnection } from '@pe/nest-kit';
import { MessageBusEventsEnum, MessageBusExchangesEnum, MessageBusRoutingKeys } from '../enums';
import { Options } from 'amqplib';
import { environment } from '../../environments';

@Injectable()
export class RabbitMqService implements OnApplicationShutdown  {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitConnection: RabbitMqConnection,
  ) { }

  public async sendEvent(
    exchange: MessageBusExchangesEnum,
    eventName: MessageBusEventsEnum | MessageBusRoutingKeys,
    payload: { },
    options?: Options.Publish,
  ): Promise<void> {
    return this.rabbitClient
      .send(
        {
          channel: eventName,
          exchange: exchange,
          options,
        },
        {
          name: eventName,
          payload,
        },
      );
  }

  public async onApplicationShutdown(signal?: string): Promise<void> {
    if (environment.rabbitPaymentNotificationQueueName) {
      await this.rabbitConnection.closeChannel(environment.rabbitPaymentNotificationQueueName);
    }
  }

}
