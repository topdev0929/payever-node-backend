import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';

import { SynchronizationModel } from '../../../src/synchronizer/models';
import { SynchronizationSchemaName } from '../../../src/synchronizer/schemas';
import { INTEGRATION_ID, BUSINESS_ID } from './const';

class SynchronizationFixture extends BaseFixture {
  private readonly synchronizationTaskModel: Model<SynchronizationModel> = this.application.get(
    getModelToken(SynchronizationSchemaName),
  );

  public async apply(): Promise<void> {
    await this.synchronizationTaskModel.create({
      businessId: BUSINESS_ID,
      integrationId: INTEGRATION_ID,

      isOutwardEnabled: true,
      isInwardEnabled: null,
      lastSynced: null,
    });

  }
}

export = SynchronizationFixture;
