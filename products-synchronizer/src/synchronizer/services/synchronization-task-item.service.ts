import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SynchronizationTaskItemDto } from '../dto';
import { ImportedSummaryItemDto } from '../dto/imported-summary-item.dto';
import { SynchronizationTaskItemModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { SynchronizationTaskItemSchemaName, SynchronizationTaskSchemaName } from '../schemas';

@Injectable()
export class SynchronizationTaskItemService {
  constructor(
    @InjectModel(SynchronizationTaskSchemaName)
    private readonly taskModel: Model<SynchronizationTaskModel>,
    @InjectModel(SynchronizationTaskItemSchemaName)
    private readonly taskItemModel: Model<SynchronizationTaskItemModel>,
  ) { }

  public async bulkCreateFromSkuList(
    taskId: string,
    importedItemsSummary: ImportedSummaryItemDto[],
  ): Promise<void> {
    const itemsDto: SynchronizationTaskItemDto[] = importedItemsSummary.map(
      (item: ImportedSummaryItemDto) => {
        return {
          isProcessed: false,
          sku: item.sku,
          task: taskId,
          type: item.type,
        };
      },
    );

    try {
      await this.taskItemModel.insertMany(itemsDto as SynchronizationTaskItemModel[], { ordered: false });
    } catch (e) {
      if (e.name === 'BulkWriteError' && e.code === 11000) {
        return;
      }

      throw e;
    }
  }

  public async setIsProcessed(
    taskItemDto: SynchronizationTaskItemDto,
  ): Promise<SynchronizationTaskItemModel> {
    const taskModel: SynchronizationTaskModel = await this.taskModel.findById(taskItemDto.task).exec();

    return this.taskItemModel.findOneAndUpdate(
      {
        sku: taskItemDto.sku,
        task: taskModel,
        type: taskItemDto.type,
      },
      {
        $set: {
          isProcessed: true,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  public async hasUnprocessed(task: SynchronizationTaskModel): Promise<boolean> {
    return (
      (await this.taskItemModel.findOne({
        isProcessed: { $ne: true },
        task: task,
      }).exec()) !== null
    );
  }

  public async getTasksIdsWithRecentUpdatedItems(
    lastUpdate: Date,
    tasks: SynchronizationTaskModel[],
  ): Promise<string[]> {
    return this.taskItemModel.distinct(
      'task',
      {
        isProcessed: true,
        task: { $in: tasks.map((task: SynchronizationTaskModel) => task.id) },
        updatedAt: { $gte: lastUpdate },
      },
    );
  }
}
