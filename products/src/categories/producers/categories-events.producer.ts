import { Injectable } from '@nestjs/common';

import { EventListener, RabbitMqClient } from '@pe/nest-kit';
import { CategoryModel, CollectionModel } from '../models';
import { CategoryEventsEnum, RabbitChannelEventsEnum } from '../enums';

@Injectable()
export class ProductsCategoriesEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  @EventListener(CategoryEventsEnum.CategoryCreated)
  private async handleCategoryCreated(category: CategoryModel): Promise<void> {
    await this.triggerEvent(RabbitChannelEventsEnum.ProductsCategoryCreated, category.toObject());
  }

  @EventListener(CategoryEventsEnum.CategoryUpdated)
  private async handleCategoryUpdated(category: CategoryModel): Promise<void> {
    await this.triggerEvent(RabbitChannelEventsEnum.ProductsCategoryUpdated, category.toObject());
  }

  @EventListener(CategoryEventsEnum.CategoryRemoved)
  private async handleCategoryRemoved(category: CategoryModel): Promise<void> {
    await this.triggerEvent(RabbitChannelEventsEnum.ProductsCategoryRemoved, category.toObject());
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
