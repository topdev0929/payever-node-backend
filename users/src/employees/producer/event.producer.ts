import { Injectable } from '@nestjs/common';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';

@Injectable()
export class EventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
  ) { }

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

  public async sendRPCMessage(payload: any, event: string): Promise<any> {
    return this.rabbitMqRPCClient.send(
      {
        channel: event,
        exchange: 'async_events',
      },
      {
        name: event,
        payload,
      },
      {
        responseType: 'json',
      },
    );
  }
}
