import { Model, DocumentDefinition } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SynchronizationTaskItemModel, SynchronizationTaskModel } from '../models';
import { SynchronizationTaskItemSchemaName, SynchronizationTaskSchemaName } from '../schemas';

@Injectable()
export class SynchronizationTaskItemService {
  constructor(
    @InjectModel(SynchronizationTaskSchemaName)
      private readonly taskModel: Model<SynchronizationTaskModel>,
    @InjectModel(SynchronizationTaskItemSchemaName)
      private readonly synchronizationTaskItemModel: Model<SynchronizationTaskItemModel>,
  ) { }

  public async create(data: DocumentDefinition<SynchronizationTaskItemModel>): Promise<SynchronizationTaskItemModel> {
    return this.synchronizationTaskItemModel.create(data);
  }

  public async setIsProcessed(
    _id: string,
  ): Promise<SynchronizationTaskItemModel> {

    return this.synchronizationTaskItemModel.findByIdAndUpdate(_id, {
      $set: {
        isProcessed: true,
      },
    }, {
      new: true,
    });
  }

  public async hasTaskUnprocessedItems(taskId: string): Promise<boolean> {
    return (
      (await this.synchronizationTaskItemModel.findOne({
        isProcessed: { $ne: true },
        taskId: taskId,
      })) !== null
    );
  }

  public async getTasksIdsWithRecentUpdatedItems(
    lastUpdate: Date,
    tasks: SynchronizationTaskModel[],
  ): Promise<string[]> {
    return this.synchronizationTaskItemModel.distinct(
      'task',
      {
        isProcessed: true,
        taskId: { $in: tasks.map((task: SynchronizationTaskModel) => task.id) },
        updatedAt: { $gte: lastUpdate },
      },
    );
  }
}
