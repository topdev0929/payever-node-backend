import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { EventApplicationProducer } from '../../../src/terminal/producers';
import * as uuid from 'uuid';

@Injectable()
export class ApplicationEventMock extends AbstractMessageMock {
  private business: any = {
    id: uuid.v4(),
  };
  private terminal: any = {
    id: uuid.v4(),
  };

  @PactRabbitMqMessageProvider('event.application.created')
  public async mockApplicationCreatedEvent(): Promise<void> {
    const producer: EventApplicationProducer = await this.getProvider<EventApplicationProducer>(
      EventApplicationProducer,
    );
    await producer.produceApplicationCreatedEvent(this.business, this.terminal);
  }

  @PactRabbitMqMessageProvider('event.application.removed')
  public async mockApplicationRemovedEvent(): Promise<void> {
    const producer: EventApplicationProducer = await this.getProvider<EventApplicationProducer>(
      EventApplicationProducer,
    );
    await producer.produceApplicationRemovedEvent(this.terminal);
  }
}
