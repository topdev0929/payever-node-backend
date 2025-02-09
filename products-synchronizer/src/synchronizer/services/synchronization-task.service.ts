import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import {
  IntegrationModel,
  FileImportModel,
  SynchronizationModel,
  SynchronizationTaskModel,
} from '@pe/synchronizer-kit';
import { FileImportDto } from '../dto/file-import.dto';
import { FailureReasonDto, ImportSuccessDto } from '../dto/product-files-rabbit-messages';
import { ImportedItemTypesEnum, SynchronizationDirectionEnum, SynchronizationStatusEnum } from '../enums';
import { SynchronizationTasKindEnum } from '../enums/synchronization-task-kind.enum';
import { CollectionSyncEventInterface, ProductSyncEventInterface, SyncEventInterface } from '../interfaces';
import { MailerEventProducer } from '../producers/mailer.event.producer';
import { FileImportSchemaName, SynchronizationTaskSchemaName } from '../schemas';
import { SynchronizationTaskItemService } from './synchronization-task-item.service';

@Injectable()
export class SynchronizationTaskService {
  constructor(
    @InjectModel(SynchronizationTaskSchemaName)
    private readonly synchronizationTaskModel: Model<SynchronizationTaskModel>,
    @InjectModel(FileImportSchemaName)
    private readonly fileImportModel: Model<FileImportModel>,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly taskItemsService: SynchronizationTaskItemService,
  ) { }

  public async createFromSynchronization(
    synchronization: SynchronizationModel,
    direction: SynchronizationDirectionEnum,
  ): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.create({
      businessId: synchronization.businessId,
      errorsList: [],
      events: [],
      integration: synchronization.integration,
      itemsSynced: 0,

      direction: direction,
      kind: SynchronizationTasKindEnum.Integration,
      status: SynchronizationStatusEnum.IN_QUEUE,
    } as SynchronizationTaskModel);
  }

  public async createFileImport(
    business: BusinessModel,
    dto: FileImportDto,
  ): Promise<SynchronizationTaskModel>  {
    const fileImport: FileImportModel = await this.fileImportModel.create(
      {
        fileUrl: dto.fileUrl,
        overwriteExisting: dto.overwriteExisting,
      } as FileImportModel);

    return this.synchronizationTaskModel.create({
      businessId: business._id,
      kind: SynchronizationTasKindEnum.FileImport,

      direction: SynchronizationDirectionEnum.INWARD,
      fileImport: fileImport._id,
      status: SynchronizationStatusEnum.IN_QUEUE,

      errorsList: [],
      events: [],
      itemsSynced: 0,
    } as SynchronizationTaskModel);
  }

  public async getOne(id: string): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findById(id);
  }

  public async getByBusinessAndIntegration(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationTaskModel[]> {
    return this.synchronizationTaskModel
      .find({ businessId: business.id, integration: integration.id })
      .sort({ startedAt: -1 });
  }

  public async getByBusiness(businessId: string, filter?: object): Promise<SynchronizationTaskModel[]> {
    return this.synchronizationTaskModel
      .find(applyFilter({ businessId: businessId }, filter))
      .sort({ startedAt: -1 });
  }

  public async getEvents(task: SynchronizationTaskModel): Promise<SyncEventInterface[]> {
    const selected: SynchronizationTaskModel = await this.synchronizationTaskModel
      .findOne({ _id: task.id })
      .select('events').exec()
    ;

    return selected && selected.events ? selected.events : [];
  }

  public async taskSuccess(task: SynchronizationTaskModel): Promise<void> {
    const updated: SynchronizationTaskModel = await this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        status: SynchronizationStatusEnum.SUCCEES,
      },
      { new: true },
    ).exec();

    await this.mailerEventProducer.triggerSuccessImportMessage(updated);
  }

  public async taskFail(task: SynchronizationTaskModel, reason: FailureReasonDto): Promise<void> {
    const updated: SynchronizationTaskModel = await this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        errorsList: [{ messages: [reason.errorMessage] }],
        failureReason: reason,
        status: SynchronizationStatusEnum.FAILURE,
      },
      { new: true },
    ).exec();

    await this.mailerEventProducer.triggerFailedImportMessage(updated);
  }

  public async taskInProgress(task: SynchronizationTaskModel): Promise<void> {
    await this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        status: SynchronizationStatusEnum.IN_PROGRESS,
      },
    ).exec();
  }

  public async productsCollectionSynchronized(
    msg: CollectionSyncEventInterface,
  ): Promise<SynchronizationTaskModel | null> {
    if (!(msg.synchronization && msg.synchronization.taskId)) {
      return null;
    }

    return this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: msg.synchronization.taskId,
      },
      {
        $inc: { itemsSynced: 1 },
        $push: {
          events: {
            date: new Date(),
            itemId: msg.itemId,
            message: '',
          },
        },
        status: msg.synchronization.isFinished
          ? SynchronizationStatusEnum.SUCCEES
          : SynchronizationStatusEnum.IN_PROGRESS,
      },
    );
  }

  public async productSynchronized(
    msg: ProductSyncEventInterface,
    itemsSynced: number = 1,
  ): Promise<SynchronizationTaskModel | null> {
    if (!(msg.synchronization && msg.synchronization.taskId)) {
      return null;
    }

    return this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: msg.synchronization.taskId,
      },
      {
        $inc: { itemsSynced: itemsSynced },
        $push: {
          events: {
            date: new Date(),
            itemId: msg.itemId,
            message: '',
          },
        },
        status: msg.synchronization.isFinished
          ? SynchronizationStatusEnum.SUCCEES
          : SynchronizationStatusEnum.IN_PROGRESS,
      },
    );
  }

  public async productSynchronizedFinished(taskId: string): Promise<SynchronizationTaskModel | null> {
    return this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        status: SynchronizationStatusEnum.SUCCEES,
      },
    );
  }

  public async setParsingResult(dto: ImportSuccessDto): Promise<void> {
    await this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: dto.synchronization.taskId,
      },
      {
        $set: { errorsList: dto.errors },
      },
    ).exec();

    if (dto.items) {
      await this.taskItemsService.bulkCreateFromSkuList(
        dto.synchronization.taskId,
        dto.items,
      );
    }

    const task: SynchronizationTaskModel
      = await this.synchronizationTaskModel.findById(dto.synchronization.taskId).exec();
    if (! await this.taskItemsService.hasUnprocessed(task)) {
      await this.taskSuccess(task);
    } else {
      await this.taskInProgress(task);
    }
  }

  public async processItem(
    taskId: string,
    sku: string,
    type: ImportedItemTypesEnum,
    errorMessage: string = null,
  ): Promise<void> {
    const task: SynchronizationTaskModel = await this.synchronizationTaskModel.findById(
      taskId,
    ).exec();

    if (!task) {
      return;
    }

    await this.taskItemsService.setIsProcessed({ task: task, sku, type });

    if (errorMessage) {
      await this.addError(task.id, errorMessage, sku);
    }

    if (
      task.status === SynchronizationStatusEnum.IN_PROGRESS &&
      !(await this.taskItemsService.hasUnprocessed(task))
    ) {
      await this.taskSuccess(task);
    }
  }

  public async getOldUnfinished(lastUpdate: Date): Promise<SynchronizationTaskModel[]> {
    return this.synchronizationTaskModel.find({
      kind: SynchronizationTasKindEnum.FileImport,
      status: {
        $in: [SynchronizationStatusEnum.IN_PROGRESS, SynchronizationStatusEnum.IN_QUEUE],
      },
      updatedAt: {
        $lte: lastUpdate,
      },
    });
  }

  private async addError(
    taskId: string,
    message: string,
    sku: string = null,
  ): Promise<void> {
    await this.synchronizationTaskModel.updateOne(
      { _id: taskId },
      {
        $push: {
          errorsList: {
            messages: [message],
            sku: sku,
          },
        },
      },
    ).exec();
  }
}

function applyFilter(conditions: object, filter: object): object {
  if (filter) {
    for (const [k, v] of Object.entries(filter)) {
      if (v) {
        conditions[k] = v;
      }
    }
  }

  return conditions;
}
