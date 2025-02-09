import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BlogModel } from '../../blog/models';
import { CommentModel } from '../models';
import { CommentRabbitEnum } from '../enums';

@Injectable()
export class CommentRabbitEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async commentCreated(business: BusinessModel, blog: BlogModel, comment: CommentModel): Promise<void> {
    this.logger.log({
      blog: blog._id,
      business: business.id,
      comment: comment.id,
      message: `RabbitmqService commentCreated`,
    });

    await this.rabbitClient.send(
      {
        channel: CommentRabbitEnum.CommentCreated,
        exchange: 'async_events',
      },
      {
        name: 'blog.event.comment.created',
        payload: {
          appType: 'blog',
          blog: blog._id,
          business: {
            id: business.id,
          },
          content: comment.content,
          id: comment.id,
        },
      },
    );
  }
}
