import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel, IntegrationModel } from '@pe/third-party-sdk';

import { OuterStockChangedDto, OuterStockDto, ProductDto, ProductRemovedDto } from '../dto';
import { MessageBusEventsEnum } from '../enum';

@Injectable()
export class EventProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async sendOuterStockCreated(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: OuterStockDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.StockCreated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.StockCreated,
        payload: {
          business: {
            id: business.id,
          },
          integration: {
            name: integration.name,
          },
          sku: dto.sku,
          stock: dto.stock,
        },
      },
    );
  }

  public async sendOuterStockAdded(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: OuterStockChangedDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.StockAdded,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.StockAdded,
        payload: {
          business: {
            id: business.id,
          },
          integration: {
            name: integration.name,
          },
          quantity: dto.quantity,
          sku: dto.sku,
        },
      },
    );
  }

  public async sendOuterStockSubtracted(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: OuterStockChangedDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.StockSubtracted,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.StockSubtracted,
        payload: {
          business: {
            id: business.id,
          },
          integration: {
            name: integration.name,
          },
          quantity: dto.quantity,
          sku: dto.sku,
        },
      },
    );
  }

  public async sendOuterProductCreated(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ProductDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ProductCreated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ProductCreated,
        payload: {
          business: {
            id: business.id,
          },
          data: {
            ...dto,
          },
          integration: {
            name: integration.name,
          },
        },
      },
    );
  }

  public async sendOuterProductUpdated(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ProductDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ProductUpdated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ProductUpdated,
        payload: {
          business: {
            id: business.id,
          },
          data: {
            ...dto,
          },
          integration: {
            name: integration.name,
          },
        },
      },
    );
  }

  public async sendOuterProductUpserted(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ProductDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ProductUpserted,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ProductUpserted,
        payload: {
          business: {
            id: business.id,
          },
          data: {
            ...dto,
          },
          integration: {
            name: integration.name,
          },
        },
      },
    );
  }

  public async sendOuterProductRemoved(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ProductRemovedDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ProductRemoved,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ProductRemoved,
        payload: {
          business: {
            id: business.id,
          },
          data: {
            ...dto,
          },
          integration: {
            name: integration.name,
          },
        },
      },
    );
  }

  public async sendOuterStockSynchronizationEvent(
    name: MessageBusEventsEnum.StockEventTrigger,
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: name,
        exchange: 'async_events',
      },
      {
        name: name,
        payload: {
          business: {
            id: business.id,
          },
          integration: {
            name: integration.name,
          },
        },
      },
    );
  }
}
