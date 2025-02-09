import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery, Query, DocumentDefinition } from 'mongoose';

import {
  SynchronizationStatusEnum,
  SynchronizationTasKindEnum,
} from '@pe/synchronizer-kit';

import { SynchronizationTaskModel } from '../models';
import { SynchronizationTaskSchemaName } from '../schemas';

@Injectable()
export class SynchronizationTaskService {
  constructor(
    @InjectModel(SynchronizationTaskSchemaName)
      private readonly synchronizationTaskModel: Model<SynchronizationTaskModel>,
  ) { }

  public create(data: DocumentDefinition<SynchronizationTaskModel>): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.create(data);
  }

  public findOne(
    filter: FilterQuery<SynchronizationTaskModel>,
  ): Query<SynchronizationTaskModel, SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findOne(filter);
  }

  public find(
    filter: FilterQuery<SynchronizationTaskModel>,
  ): Query<SynchronizationTaskModel[], SynchronizationTaskModel> {
    return this.synchronizationTaskModel.find(filter);
  }

  public findById(id: string): Query<SynchronizationTaskModel, SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findById(id);
  }

  public async findByIdAndUpdate(
    id: string,
    data: UpdateQuery<SynchronizationTaskModel>,
  ): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async setSuccessStatus(taskId: string): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findOneAndUpdate(
      {
        _id: taskId,
        status: {
          $ne: SynchronizationStatusEnum.SUCCEES,
        },
      },
      {
        status: SynchronizationStatusEnum.SUCCEES,
      },
      { new: true },
    );
  }

  public async setFailStatus(
    taskId: string,
    reason: { errorMessage: string },
  ): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findByIdAndUpdate(taskId, {
      errorsList: [{ messages: [reason.errorMessage] }],
      failureReason: reason,
      status: SynchronizationStatusEnum.FAILURE,
    }, {
      new: true,
    });
  }

  public async setInProgressStatus(taskId: string): Promise<void> {
    await this.synchronizationTaskModel.findByIdAndUpdate(taskId, {
      status: SynchronizationStatusEnum.IN_PROGRESS,
    });
  }

  public async addSynchronizationEventItem(
    contactId: string,
    taskId: string,
  ): Promise<SynchronizationTaskModel> {
    return this.synchronizationTaskModel.findByIdAndUpdate(taskId, {
        $inc: { itemsSynced: 1 },
        $push: {
          events: {
            date: new Date(),
            itemId: contactId,
            message: '',
          },
        },
      },
    );
  }

  public async addError(
    taskId: string,
    message: string,
    email: string = null,
  ): Promise<SynchronizationTaskModel> {
    return this.findByIdAndUpdate(taskId, {
      $push: {
        errorsList: {
          email,
          messages: [message],
        },
      },
    });
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
}
