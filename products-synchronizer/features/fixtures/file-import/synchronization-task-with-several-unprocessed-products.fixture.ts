import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { SynchronizationTaskItemModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { SynchronizationTaskItemSchemaName, SynchronizationTaskSchemaName } from '../../../src/synchronizer/schemas';
import { businessFactory, synchronizationTaskFactory, synchronizationTaskItemFactory } from '../factories';
import { getModelToken } from '@nestjs/mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import constants from '../integration/constants';

const SYNCHRONIZATION_TASK_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ITEM_SKU: string = 'Test_SKU';

class SynchronizationTaskWithSeveralUnprocessedProductsFixture extends BaseFixture {

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
    }) as any);

    await this.synchronizationTaskModel.create(synchronizationTaskFactory({
      _id: SYNCHRONIZATION_TASK_ID,
      businessId: BUSINESS_ID,
      status: 'in_progress',
      integration: constants.integrationId,
    }) as any);

    await this.synchronizationTaskItemModel.create(synchronizationTaskItemFactory({
      isProcessed: false,
      sku: ITEM_SKU,
      task: SYNCHRONIZATION_TASK_ID,
      type: 'product',
    }) as any);

    for (let i: number = 1; i <= 3; i++) {
      await this.synchronizationTaskItemModel.create(synchronizationTaskItemFactory({
        isProcessed: false,
        sku: `Test_SKU_${i}`,
        task: SYNCHRONIZATION_TASK_ID,
        type: 'product',
      }) as any);
    }
  }
}

export = SynchronizationTaskWithSeveralUnprocessedProductsFixture;
