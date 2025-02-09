import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

@Injectable()
export class ProductsEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async syncProduct(productId: string): Promise<void> {
    await this.triggerEvent('products.event.product.request.export', { productId: productId });
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
