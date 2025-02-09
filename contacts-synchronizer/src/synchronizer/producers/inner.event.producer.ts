import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { FileImportTriggeredEventDto } from '@pe/synchronizer-kit';

import { ThirdPartyActionEnum, ThirdPartyRmqOutgoingEventsEnum, ContactFilesRmqOutgoingEventsEnum } from '../enums';
import { SynchronizationModel, SynchronizationTaskModel } from '../models';
import { ContactIncomingEventMessageDto } from '../../contacts/dto/incoming';

/**
 * This producer firing events about changes from Payever services to outer integrations.
 * Also it calls actions of outer integrations using ThirdParty service.
 */
@Injectable()
export class InnerEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async produceTaskCreated(task: SynchronizationTaskModel): Promise<void> {
    await task.populate('fileImport').execPopulate();

    const payload: FileImportTriggeredEventDto = {
      business: {
        id: task.businessId,
      },
      fileImport: task.fileImport,
      synchronization: {
        taskId: task.id,
      },
    };

    this.logger.log({
      context: 'InnerEventProducer',
      message: `SENDING "${ContactFilesRmqOutgoingEventsEnum.TriggerImport}" event`,
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: ContactFilesRmqOutgoingEventsEnum.TriggerImport,
        exchange: 'async_events',
      },
      {
        name: ContactFilesRmqOutgoingEventsEnum.TriggerImport,
        payload,
      },
    );

    this.logger.log('sent');
  }

  public async callIntegrationAction(
    synchronization: SynchronizationModel,
    action: ThirdPartyActionEnum,
    data: any = { },
    task: SynchronizationTaskModel,
  ): Promise<void> {
    await synchronization
      .populate('integration')
      .execPopulate();

    const payload: any = {
      business: {
        id: synchronization.businessId,
      },
      integration: {
        name: synchronization.integration.name,
      },
      synchronization: task
        ? { taskId: task.id }
        : undefined,

      action,
      data,
    };

    this.logger.log({
      context: 'InnerEventProducer',
      message: 'SENDING "synchronizer.event.action.call" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: ThirdPartyRmqOutgoingEventsEnum.CallAction,
        exchange: 'async_events',
      },
      {
        name: ThirdPartyRmqOutgoingEventsEnum.CallAction,
        payload,
      },
    );

    this.logger.log({
      context: 'InnerEventProducer',
      message: `SENT "${ThirdPartyRmqOutgoingEventsEnum.CallAction}" event`,
      payload,
    });
  }

  public async produceCreateInnerContact(
    synchronization: SynchronizationModel,
    payload: ContactIncomingEventMessageDto,
    task?: SynchronizationTaskModel,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      ThirdPartyActionEnum.CreateContact,
      payload,
      task,
    );
  }

  public async produceUpdateInnerContact(
    synchronization: SynchronizationModel,
    payload: ContactIncomingEventMessageDto,
    task?: SynchronizationTaskModel,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      ThirdPartyActionEnum.UpdateContact,
      payload,
      task,
    );
  }

  public async produceRemoveInnerContact(
    synchronization: SynchronizationModel,
    payload: ContactIncomingEventMessageDto,
    task?: SynchronizationTaskModel,
  ): Promise<void> {
    return this.callIntegrationAction(
      synchronization,
      ThirdPartyActionEnum.RemoveContact,
      payload,
      task,
    );
  }
}
