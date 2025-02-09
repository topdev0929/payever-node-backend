import { Model } from 'mongoose';

import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';

import { TaskDocument } from '../../src/onboarding/schemas';

import * as taskPrototype from './task.json';
import { TASK_ID, BUSINESS_ID, BULK_IMPORT_ID } from './const';

class TaskFixture extends BaseFixture {
  protected readonly taskModel: Model<TaskDocument> =
    this.application.get(getModelToken('Task'));
  public async apply(): Promise<void> {
    await this.taskModel.create({
      ...taskPrototype,
      _id: TASK_ID,
      bulkImportId: BULK_IMPORT_ID,
      businessId: BUSINESS_ID,
      token: '-old-token-value',
    });
  }
}

export = TaskFixture;
