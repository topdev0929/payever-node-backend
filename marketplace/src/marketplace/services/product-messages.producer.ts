import { Injectable } from '@nestjs/common';
import { ProductModel, ProductSubscriptionModel } from '../interfaces/entities';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../enums';

@Injectable()
export class ProductMessagesProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceProductSubscriptionRemoved(
    product: ProductModel,
    subscription: ProductSubscriptionModel,
  ): Promise<void> {
    return this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.ProductSubscriptionDeleted,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.ProductSubscriptionDeleted,
        payload: {
          business: {
            id: subscription.business.id,
          },
          marketplaceProduct: {
            id: product.id,
          },
          product: {
            id: subscription.productId,
          },
        },
      },
    );
  }
}
