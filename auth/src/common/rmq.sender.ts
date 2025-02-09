import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

@Injectable()
export class RmqSender {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async send(channel: string, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload,
      },
      true,
    );
  }
}
