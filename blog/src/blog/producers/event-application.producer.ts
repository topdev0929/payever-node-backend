import { RabbitMqClient } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessModel } from 'src/business';
import { BlogModel } from '../models';

@Injectable()
export class EventApplicationProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceApplicationCreatedEvent(business: BusinessModel, blog: BlogModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'event.application.created',
        exchange: 'async_events',
      },
      {
        name: 'event.application.created',
        payload: {
          business: business.id,
          id: blog.id,
          type: 'blog',
        },
      },
    );
  }

  public async produceApplicationRemovedEvent(blog: BlogModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'event.application.removed',
        exchange: 'async_events',
      },
      {
        name: 'event.application.removed',
        payload: {
          id: blog.id,
        },
      },
    );
  }
}
