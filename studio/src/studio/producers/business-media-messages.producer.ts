import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { UserMediaModel } from '../models';
import { MediaMessagesEnum } from '../enums';

@Injectable()
export class BusinessMediaMessagesProducer {

  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendMediaCreatedMessage(media: UserMediaModel): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: MediaMessagesEnum.BusinessMediaCreated,
          exchange: 'async_events',
        },
        {
          name: MediaMessagesEnum.BusinessMediaCreated,
          payload: {
            business: {
              id: media.businessId,
            },
            id: media.id,
            mediaType: media.mediaType,
            name: media.name,
            url: media.url,
          },
        },
      );
  }

  public async sendMediaUpdatedMessage(media: UserMediaModel): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: MediaMessagesEnum.BusinessMediaUpdated,
          exchange: 'async_events',
        },
        {
          name: MediaMessagesEnum.BusinessMediaUpdated,
          payload: {
            business: {
              id: media.businessId,
            },
            id: media.id,
            mediaType: media.mediaType,
            name: media.name,
            url: media.url,
          },
        },
      );
  }

  public async sendMediaDeletedMessage(media: UserMediaModel): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: MediaMessagesEnum.BusinessMediaDeleted,
          exchange: 'async_events',
        },
        {
          name: MediaMessagesEnum.BusinessMediaDeleted,
          payload: {
            business: {
              id: media.businessId,
            },
            id: media.id,
          },
        },
      );
  }
}
