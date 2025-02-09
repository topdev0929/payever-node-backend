import { Injectable } from '@nestjs/common';

import { RabbitMqClient } from '@pe/nest-kit';
import { CollectionModel } from '../models';
import { RabbitChannelEventsEnum } from '../enums';

@Injectable()
export class ProductsCollectionsEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async productsCollectionCreated(collection: CollectionModel): Promise<void> {
    await this.triggerEvent(RabbitChannelEventsEnum.ProductsCollectionCreated, collection.toObject());
  }

  public async productsCollectionUpdated(
    originalCollection: CollectionModel,
    collection: CollectionModel,
  ): Promise<void> {
    await this.triggerEvent(RabbitChannelEventsEnum.ProductsCollectionUpdated, collection.toObject());
  }

  public async productsCollectionRemoved(collection: CollectionModel): Promise<void> {
    await this.triggerEvent(RabbitChannelEventsEnum.ProductsCollectionRemoved, collection.toObject());
  }

  private async triggerEvent(eventName: string, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }
}
