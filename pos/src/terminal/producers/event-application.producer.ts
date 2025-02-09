import { RabbitMqClient } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessModel } from 'src/business';
import { TerminalModel } from '../models';

@Injectable()
export class EventApplicationProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceApplicationCreatedEvent(business: BusinessModel, terminal: TerminalModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'event.application.created',
        exchange: 'async_events',
      },
      {
        name: 'event.application.created',
        payload: {
          business: business.id,
          id: terminal.id,
          type: 'pos',
        },
      },
    );
  }

  public async produceApplicationRemovedEvent(terminal: TerminalModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'event.application.removed',
        exchange: 'async_events',
      },
      {
        name: 'event.application.removed',
        payload: {
          id: terminal.id,
        },
      },
    );
  }
}
