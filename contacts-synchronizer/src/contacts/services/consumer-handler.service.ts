import { Injectable, Logger } from '@nestjs/common';
import { BusinessModel, BusinessService } from '@pe/business-kit';

import {
  SynchronizationModel,
  SynchronizationTaskModel,
  InnerEventProducer,
  SynchronizationTaskService,
  SynchronizationService,
  SynchronizationTaskItemService,
  MailerEventProducer,
} from '../../synchronizer';
import {
  ContactsSynchronizationIncomingEventMessageDto,
  ContactIncomingEventMessageDto,
  ContactSynchronizationFailedDto,
} from '../dto/incoming';

@Injectable()
export class ConsumerHandlerService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly synchronizationService: SynchronizationService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly synchronizationTaskItemService: SynchronizationTaskItemService,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly innerEventProducer: InnerEventProducer,
    private readonly logger: Logger,
  ) { }

  public async handleOnContactCreatedEvent(
    payload: ContactIncomingEventMessageDto,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      payload.contact.businessId,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessId = ${payload.contact.businessId}, but business not found`,
      );

      return;
    }

    const synchronizations: SynchronizationModel[] = await this.synchronizationService
      .findAllBusinessOutwardings(
        business,
      );

    for (const synchronization of synchronizations) {
      await this.innerEventProducer.produceCreateInnerContact(
        synchronization,
        payload,
      );
    }
  }

  public async handleOnContactUpdatedEvent(
    payload: ContactIncomingEventMessageDto,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      payload.contact.businessId,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessId = ${payload.contact.businessId}, but business not found`,
      );

      return;
    }
    const synchronizations: SynchronizationModel[] =
      await this.synchronizationService.findAllBusinessOutwardings(business);

    for (const synchronization of synchronizations) {
      await this.innerEventProducer.produceUpdateInnerContact(
        synchronization,
        payload,
      );
    }
  }

  public async handleOnContactRemovedEvent(
    payload: ContactIncomingEventMessageDto,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      payload.contact.businessId,
    );
    if (!business) {
      this.logger.warn(
        `received event with businessId = ${payload.contact.businessId}, but business not found`,
      );

      return;
    }

    const synchronizations: SynchronizationModel[] =
      await this.synchronizationService.findAllBusinessOutwardings(business);

    for (const synchronization of synchronizations) {
      await this.innerEventProducer.produceRemoveInnerContact(
        synchronization,
        payload,
      );
    }
  }

  public async handleOnSyncContactCreated(payload: ContactsSynchronizationIncomingEventMessageDto): Promise<void> {
    const syncTaskItemId: string = payload.synchronization.taskItemId;
    await this.synchronizationTaskItemService.setIsProcessed(syncTaskItemId);
    await this.synchronizationTaskService.addSynchronizationEventItem(
      payload.contact._id,
      payload.synchronization.taskId,
    );
    await this.handleTaskIsFinished(payload.synchronization.taskId);
  }

  // eslint-disable-next-line sonarjs/no-identical-functions
  public async handleOnSyncContactUpdated(payload: ContactsSynchronizationIncomingEventMessageDto): Promise<void> {
    const syncTaskItemId: string = payload.synchronization.taskItemId;
    await this.synchronizationTaskItemService.setIsProcessed(syncTaskItemId);
    await this.synchronizationTaskService.addSynchronizationEventItem(
      payload.contact._id,
      payload.synchronization.taskId,
    );
    await this.handleTaskIsFinished(payload.synchronization.taskId);
  }

  public async handleOnSyncContactFailed(payload: ContactSynchronizationFailedDto): Promise<void> {
    const syncTaskItemId: string = payload.synchronization.taskItemId;
    await this.synchronizationTaskItemService.setIsProcessed(syncTaskItemId);
    await this.synchronizationTaskService.addError(
      payload.synchronization.taskId,
      payload.errorMessage,
      payload.contact.email,
    );
    await this.handleTaskIsFinished(payload.synchronization.taskId);
  }

  private async handleTaskIsFinished(taskId: string): Promise<void> {
    if (!(await this.synchronizationTaskItemService.hasTaskUnprocessedItems(taskId))) {
      const updatedTask: SynchronizationTaskModel =
        await this.synchronizationTaskService.setSuccessStatus(taskId);
      if (updatedTask?.status) {
        await this.mailerEventProducer.triggerSuccessImportMessage(updatedTask);
      }
    }

  }
}
