import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

@Injectable()
export class EventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async sendMessage(payload: any, event: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: event,
        exchange: 'async_events',
      },
      {
        name: event,
        payload,
      },
      true,
    );
  }
}
