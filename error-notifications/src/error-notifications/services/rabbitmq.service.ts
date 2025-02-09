import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { MessageBusEventsEnum, MessageBusExchangesEnum } from '../enums';

@Injectable()
export class RabbitMqService {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendEvent(
    exchange: MessageBusExchangesEnum,
    eventName: MessageBusEventsEnum,
    payload: { },
  ): Promise<void> {
    return this.rabbitClient
      .send(
        {
          channel: eventName,
          exchange: exchange,
        },
        {
          name: eventName,
          payload,
        },
      );
  }
}
