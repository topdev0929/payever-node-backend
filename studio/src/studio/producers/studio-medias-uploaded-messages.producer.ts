import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMqEnum } from '../../environments';
import { BlobInterface } from '../interfaces/blob.interface';

@Injectable()
export class StudioMediasUploadedMessagesProducer {

  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private logger: Logger,
  ) { }

  public async userMediasUploaded(medias: BlobInterface[], businessId: string): Promise<void> {
    this.logger.log(`Generate Video Finished ${RabbitMqEnum.UserMediasUploaded} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMqEnum.UserMediasUploaded,
          exchange: 'async_events',
        },
        {
          name: RabbitMqEnum.UserMediasUploaded,
          payload: {
            businessId: businessId,
            medias: medias,
          },
        },
      );
  }

  public async userMediasUploadedError(medias: string[], businessId: string): Promise<void> {
    this.logger.log(`Generate Video Finished ${RabbitMqEnum.UserMediasUploadedError} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMqEnum.UserMediasUploadedError,
          exchange: 'async_events',
        },
        {
          name: RabbitMqEnum.UserMediasUploadedError,
          payload: {
            businessId: businessId,
            medias: medias,
          },
        },
      );
  }

  public async subscriptionMediasUploaded(medias: BlobInterface[]): Promise<void> {
    this.logger.log(`Generate Video Finished ${RabbitMqEnum.SubscriptionMediasUploaded} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMqEnum.SubscriptionMediasUploaded,
          exchange: 'async_events',
        },
        {
          name: RabbitMqEnum.SubscriptionMediasUploaded,
          payload: {
            medias: medias,
          },
        },
      );
  }

  public async subscriptionMediasUploadedError(medias: string[]): Promise<void> {
    this.logger.log(`Generate Video Finished ${RabbitMqEnum.SubscriptionMediasUploadedError} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMqEnum.SubscriptionMediasUploadedError,
          exchange: 'async_events',
        },
        {
          name: RabbitMqEnum.SubscriptionMediasUploadedError,
          payload: {
            medias: medias,
          },
        },
      );
  }
}
