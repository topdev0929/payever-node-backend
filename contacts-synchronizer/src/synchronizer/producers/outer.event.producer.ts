import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import { SynchronizationTaskItemModel } from '../models';
import { ContactDto, ContactFieldDto } from '../dto/contacts';
import { ContactsRmqEventsOutgoingEventsEnum } from '../enums';
import { SynchronizationTaskExtraArgumentsInterface } from '../interfaces';

/**
 * This producer firing events about changes from outer integrations to Payever services.
 * Also it fires events to inner services using Message bus.
 */
@Injectable()
export class OuterEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async produceCreateOuterContact(
    businessId: string,
    dto: ContactDto,
    synchronizationTaskItem?: SynchronizationTaskItemModel,
    extraArguments?: SynchronizationTaskExtraArgumentsInterface,
  ): Promise<void> {
    const payload: { } = {
      business: {
        id: businessId,
      },
      payload: {
        email: dto.email,
        fields: this.convertContactObjectToFieldDtos(dto),
        type: dto.type || 'person',
      },
      synchronization: {
        taskId: synchronizationTaskItem.taskId,
        taskItemId: synchronizationTaskItem._id,
        extraArguments,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENDING ${ContactsRmqEventsOutgoingEventsEnum.Create} event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: ContactsRmqEventsOutgoingEventsEnum.Create,
        exchange: 'async_events',
      },
      {
        name: ContactsRmqEventsOutgoingEventsEnum.Create,
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENT ${ContactsRmqEventsOutgoingEventsEnum.Create} event`,
      payload,
    });
  }

  public async produceUpsertOuterContact(
    businessId: string,
    dto: ContactDto,
    synchronizationTaskItem?: SynchronizationTaskItemModel,
    extraArguments?: SynchronizationTaskExtraArgumentsInterface,
  ): Promise<void> {
    const payload: { } = {
      business: { id: businessId },
      payload: {
        email: dto.email,
        fields: this.convertContactObjectToFieldDtos(dto),
        type: dto.type || 'person',
      },
      synchronization: {
        taskId: synchronizationTaskItem.taskId,
        taskItemId: synchronizationTaskItem._id,
        extraArguments,
      },
    };

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENDING ${ContactsRmqEventsOutgoingEventsEnum.Upsert} event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: ContactsRmqEventsOutgoingEventsEnum.Upsert,
        exchange: 'async_events',
      },
      {
        name: ContactsRmqEventsOutgoingEventsEnum.Upsert,
        payload,
      },
    );

    this.logger.log({
      context: 'OuterEventProducer',
      message: `SENT ${ContactsRmqEventsOutgoingEventsEnum.Upsert} event`,
      payload,
    });
  }

  private convertContactObjectToFieldDtos(dto: ContactDto): ContactFieldDto[] {
    // eslint-disable-next-line @typescript-eslint/typedef
    return Object.entries(dto).filter(([name]) => name !== 'type').map(([name, value]) => ({ name, value }));
  }
}
