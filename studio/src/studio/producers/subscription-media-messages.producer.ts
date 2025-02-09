import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { SubscriptionMediaModel, UserMediaModel } from '../models';
import { MediaMessagesEnum } from '../enums';

@Injectable()
export class SubscriptionMediaMessagesProducer {

  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendMediaUpsertMessage(media: SubscriptionMediaModel): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: MediaMessagesEnum.SubscriptionMediaUpsert,
          exchange: 'async_events',
        },
        {
          name: MediaMessagesEnum.SubscriptionMediaUpsert,
          payload: {
            id: media.id,
            mediaType: media.mediaType,
            name: media.name,
            url: media.url,
          },
        },
      );
  }

  public async sendMediaDeletedMessage(media: SubscriptionMediaModel): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: MediaMessagesEnum.SubscriptionMediaDeleted,
          exchange: 'async_events',
        },
        {
          name: MediaMessagesEnum.SubscriptionMediaDeleted,
          payload: {
            id: media.id,
          },
        },
      );
  }
}
