import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../products/models';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessDto } from '../../business/dto';

@Injectable()
export class SampleProductsEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async sampleProductsCreated(businessDto: BusinessDto, products: ProductModel[]): Promise<void> {
    await this.triggerEvent('products.event.sampleproduct.created', {
      business: businessDto,
      products: products,
    });
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
