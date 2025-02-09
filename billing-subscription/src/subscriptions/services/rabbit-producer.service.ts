import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

/**
 * @todo remove
 * @unused
 */
@Injectable()
export class RabbitProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async send(channel: string, plan: any): Promise<void> {
    return this.rabbitClient.send(
      {
        channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload: plan,
      },
    );
  }
}
