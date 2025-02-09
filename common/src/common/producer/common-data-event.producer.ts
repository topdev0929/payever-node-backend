import { RabbitMqClient } from '@pe/nest-kit';
import { DataAccessorContainer, ExportEventNamesEnum, RemoveOutdatedEventNamesEnum } from '@pe/common-sdk';
import { Document } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonDataEventProducer {

  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly dataAccessorContainer: DataAccessorContainer,
  ) { }

  public async produceUpdateEvent(modelName: string, model: Document): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: ExportEventNamesEnum[modelName],
        exchange: 'async_events',
      },
      {
        name: ExportEventNamesEnum[modelName],
        payload: await this.dataAccessorContainer.getAccessor(modelName).convertModelToDto(model),
      },
    );
  }

  public async produceRemoveOutdatedEvent(modelName: string, identities: any[]): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RemoveOutdatedEventNamesEnum[modelName],
        exchange: 'async_events',
      },
      {
        name: RemoveOutdatedEventNamesEnum[modelName],
        payload: identities,
      },
    );
  }
}
