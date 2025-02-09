import { Injectable } from '@nestjs/common';
import { RabbitMqRPCClient } from '@pe/nest-kit';

@Injectable()
export class OnboardingEventsProducer {
  constructor(
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
  ) { }

  public async sendRPCCall(payload: any, eventName: string): Promise<any> {
    return this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
      {
        responseType: 'json',
      },
    );
  }
}
