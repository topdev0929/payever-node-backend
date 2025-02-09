import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { ImportedItemTypesEnum } from '@pe/synchronizer-kit';

import { SynchronizationTaskItemModel } from '../../../src/synchronizer/models';
import { SynchronizationTaskItemSchemaName } from '../../../src/synchronizer/schemas';
import { SYNCHRONIZATION_TASK_ID, SYNCHRONIZATION_TASK_ITEM_ID } from './const';

class SynchronizationTasksItemsFixture extends BaseFixture {
  private readonly synchronizationTaskModel: Model<SynchronizationTaskItemModel> = this.application.get(
    getModelToken(SynchronizationTaskItemSchemaName),
  );
  public async apply(): Promise<void> {
    await this.synchronizationTaskModel.create({
      _id: SYNCHRONIZATION_TASK_ITEM_ID,
      email: 'user@example.com',
      isProcessed: false,
      taskId: SYNCHRONIZATION_TASK_ID,
      type: ImportedItemTypesEnum.Contact,
    });
  }
}

export = SynchronizationTasksItemsFixture;
