import { Injectable, Logger } from '@nestjs/common';

import {
  SynchronizationTaskService,
  SynchronizationTaskItemService,
  SynchronizationTaskModel,
  OuterEventProducer,
  MailerEventProducer,
  SynchronizationTaskItemModel,
} from '../../synchronizer';
import { ImportSuccessDto, ContactParsedRowDto, ImportFailedDto } from '../dto/incoming';

@Injectable()
export class ConsumerHandlerService {
  constructor(
    private readonly outerEventProducer: OuterEventProducer,
    private readonly synchronizationTaskItemService: SynchronizationTaskItemService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly logger: Logger,
    private readonly mailerEventProducer: MailerEventProducer,
  ) { }

  public async handleFileRowParsedEvent(
    dto: ContactParsedRowDto,
  ): Promise<void> {
    this.logger.log({
      dto,
      message: 'Contact file row parsed event',
    });

    const synchronizationTask: SynchronizationTaskModel = await this.synchronizationTaskService.findById(
      dto.synchronization.taskId,
    ).populate('fileImport');
    if (!synchronizationTask) {
      return this.logger.warn({
        dto,
        message: `Contact import event: sync task not found. Ignoring...`,
      });
    }

    const taskItem: SynchronizationTaskItemModel = await this.synchronizationTaskItemService.create({
      email: dto.data.email,
      taskId: synchronizationTask._id,
      type: dto.data.type,
      isProcessed: false,
    });

    if (synchronizationTask.fileImport.overwriteExisting === true) {
      await this.outerEventProducer.produceUpsertOuterContact(
        synchronizationTask.businessId,
        dto.data,
        taskItem,
        synchronizationTask.extraArguments,
      );
    } else {
      await this.outerEventProducer.produceCreateOuterContact(
        synchronizationTask.businessId,
        dto.data,
        taskItem,
        synchronizationTask.extraArguments,
      );
    }
  }

  public async handleParseSuccessEvent(dto: ImportSuccessDto): Promise<void> {
    const taskId: string = dto.synchronization.taskId;
    this.logger.log({
      dto,
      message: 'Contact file success parse event',
    });

    await this.synchronizationTaskService.findByIdAndUpdate(taskId, {
        $set: { errorsList: dto.errors },
      },
    );

    await this.synchronizationTaskService.setInProgressStatus(taskId);
  }

  public async handleParseFailedEvent(dto: ImportFailedDto): Promise<void> {
    this.logger.log({
      dto,
      message: 'Contact file failed parse event',
    });

    const task: SynchronizationTaskModel = await this.synchronizationTaskService.findById(dto.synchronization.taskId);
    if (!task) {
      this.logger.error({
        dto,
        message: 'Task is not found',
      });

      return;
    }

    const updated: SynchronizationTaskModel =
      await this.synchronizationTaskService.setFailStatus(dto.synchronization.taskId, dto.data);
    await this.mailerEventProducer.triggerFailedImportMessage(updated);
  }
}
