import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import {
  SynchronizationDirectionEnum,
  SynchronizationStatusEnum,
  SynchronizationTasKindEnum,
} from '@pe/synchronizer-kit';

import { SynchronizationTaskModel } from '../../../src/synchronizer/models';
import { SynchronizationTaskSchemaName } from '../../../src/synchronizer/schemas';
import { BUSINESS_ID, TASK_ID, FOREIGN_BUSINESS_ID, FOREIGN_BUSINESS_TASK_ID } from './const';


class SynchronizationTasksFixture extends BaseFixture {
  private readonly synchronizationTasksModel: Model<SynchronizationTaskModel> = this.application.get(
    getModelToken(SynchronizationTaskSchemaName),
  );
  public async apply(): Promise<void> {
    await this.synchronizationTasksModel.create({
      _id: TASK_ID,
      businessId: BUSINESS_ID,
      direction: SynchronizationDirectionEnum.INWARD,
      errorsList: [],
      events: [{
        date: new Date(),
        itemId: '776c652c-826e-4559-b1b0-4fe80657a340',
        message: 'event1-message',
      }, {
        date: new Date(),
        itemId: '8e8feec5-f5bf-4d11-96dc-52fac239a33e',
        message: 'event2-message',
      }],
      itemsSynced: 0,
      kind: SynchronizationTasKindEnum.FileImport,
      status: SynchronizationStatusEnum.IN_PROGRESS,
    });
    await this.synchronizationTasksModel.create({
      _id: 'f0be42fa-296a-437a-9782-fcb67adf0e7f',
      businessId: BUSINESS_ID,
      direction: SynchronizationDirectionEnum.OUTWARD,
      errorsList: [],
      events: [],
      itemsSynced: 0,
      kind: SynchronizationTasKindEnum.FileImport,
      status: SynchronizationStatusEnum.IN_PROGRESS,
    });
    await this.synchronizationTasksModel.create({
      _id: FOREIGN_BUSINESS_TASK_ID,
      businessId: FOREIGN_BUSINESS_ID,
      direction: SynchronizationDirectionEnum.INWARD,
      errorsList: [],
      events: [],
      itemsSynced: 0,
      kind: SynchronizationTasKindEnum.FileImport,
      status: SynchronizationStatusEnum.IN_PROGRESS,
    });
  }
}

export = SynchronizationTasksFixture;
