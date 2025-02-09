import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { SynchronizationTaskModel } from '../../../src/synchronizer/models';
import { SynchronizationTaskSchemaName } from '../../../src/synchronizer/schemas';
import { businessFactory, synchronizationTaskFactory, synchronizationTaskItemFactory } from '../factories';
import { getModelToken } from '@nestjs/mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { SynchronizationStatusEnum } from '@pe/synchronizer-kit';

const SYNCHRONIZATION_TASK_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class SynchronizationTaskInQueueFixture extends BaseFixture {

  private readonly synchronizationTaskModel: Model<SynchronizationTaskModel> = this.application.get(
    getModelToken(SynchronizationTaskSchemaName),
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
      status: SynchronizationStatusEnum.IN_QUEUE,
    }));
  }
}

export = SynchronizationTaskInQueueFixture;
