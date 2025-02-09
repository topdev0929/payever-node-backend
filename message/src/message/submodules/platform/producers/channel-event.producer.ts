import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { ChannelRmqEventsEnum } from '../../../enums';

@Injectable()
export class ChannelEventProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) {
  }

  public async produceChannelCreationEvent<T>(channel: T): Promise<void> {
    await this.sendMessage(ChannelRmqEventsEnum.ChannelCreated, {
      channel,
    });
  }

  private sendMessage<T>(channel: string, payload: T): Promise<void> {
    return this.rabbitClient.send(
      {
        channel: channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload: payload,
      },
    );
  }
}
