import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { SynchronizationTaskItemModel, SynchronizationTaskModel } from '../../../src/synchronizer/models';
import { SynchronizationTaskItemSchemaName, SynchronizationTaskSchemaName } from '../../../src/synchronizer/schemas';
import { businessFactory, synchronizationTaskFactory, synchronizationTaskItemFactory } from '../factories';
import { getModelToken } from '@nestjs/mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { SynchronizationStatusEnum, ImportedItemTypesEnum } from '@pe/synchronizer-kit';

const SYNCHRONIZATION_TASK_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ITEM_EMAIL: string = 'Test_EMAIL';

class SynchronizationTaskWithSeveralUnprocessedContactsFixture extends BaseFixture {

  private readonly synchronizationTaskModel: Model<SynchronizationTaskModel> = this.application.get(
    getModelToken(SynchronizationTaskSchemaName),
  );

  private readonly synchronizationTaskItemModel: Model<SynchronizationTaskItemModel> = this.application.get(
    getModelToken(SynchronizationTaskItemSchemaName),
  );

  private readonly businessModel: Model<BusinessModel> = this.application.get(
    getModelToken(BusinessSchemaName),
  );

  public async apply(): Promise<void> {

    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));

    await this.synchronizationTaskModel.create(synchronizationTaskFactory({
      _id: SYNCHRONIZATION_TASK_ID,
      businessId: BUSINESS_ID,
      status: SynchronizationStatusEnum.IN_PROGRESS,
    }));

    await this.synchronizationTaskItemModel.create(synchronizationTaskItemFactory({
      isProcessed: false,
      email: ITEM_EMAIL,
      taskId: SYNCHRONIZATION_TASK_ID,
      type: ImportedItemTypesEnum.Contact,
    }));

    for (let i: number = 1; i <= 3; i++) {
      await this.synchronizationTaskItemModel.create(synchronizationTaskItemFactory({
        isProcessed: false,
        email: `Test_EMAIL_${i}`,
        taskId: SYNCHRONIZATION_TASK_ID,
        type: ImportedItemTypesEnum.Contact,
      }));
    }
  }
}

export = SynchronizationTaskWithSeveralUnprocessedContactsFixture;
