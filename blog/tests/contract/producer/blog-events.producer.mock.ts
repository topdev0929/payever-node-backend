import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import { ChannelSetModel } from '@pe/channels-sdk';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { BlogModel, BlogRabbitEventsProducer } from '../../../src/blog';
import { BusinessModel } from '../../../src/business';

@Injectable()
export class BlogRabbitEventMessagesMock extends AbstractMessageMock {
  private business: BusinessModel = {
    id: uuid.v4(),
  } as BusinessModel;

  private blog: BlogModel = {
    business: {
      id: uuid.v4(),
    } as BusinessModel,
    channelSet: {
      id: uuid.v4(),
    } as ChannelSetModel,
    id: uuid.v4(),
    name: 'Blog name',
    picture: 'picture',
    type: 'blog',

    populate(): any {
      return this;
    },
    execPopulate(): any {
      return this;
    },
  } as any;

  @PactRabbitMqMessageProvider('blog.event.blog.created')
  public async mockBlogCreated(): Promise<void> {
    const producer: BlogRabbitEventsProducer =
      await this.getProvider<BlogRabbitEventsProducer>(BlogRabbitEventsProducer);
    await producer.blogCreated(this.business, this.blog);
  }

  @PactRabbitMqMessageProvider('blog.event.blog.updated')
  public async mockBlogUpdated(): Promise<void> {
    const producer: BlogRabbitEventsProducer =
      await this.getProvider<BlogRabbitEventsProducer>(BlogRabbitEventsProducer);
    await producer.blogUpdated(this.business, this.blog);
  }

  @PactRabbitMqMessageProvider('blog.event.blog.removed')
  public async mockBlogRemoved(): Promise<void> {
    const producer: BlogRabbitEventsProducer =
      await this.getProvider<BlogRabbitEventsProducer>(BlogRabbitEventsProducer);
    await producer.blogRemoved(this.business.id, this.blog);
  }

  @PactRabbitMqMessageProvider('blog.event.blog.export')
  public async mockBlogExport(): Promise<void> {
    const producer: BlogRabbitEventsProducer =
      await this.getProvider<BlogRabbitEventsProducer>(BlogRabbitEventsProducer);
    await producer.produceBlogExportEvent(this.blog, 'domain');
  }
}
