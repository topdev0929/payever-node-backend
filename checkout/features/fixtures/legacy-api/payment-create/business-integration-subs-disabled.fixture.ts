import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessIntegrationSubSchemaName } from '../../../../src/mongoose-schema';
import { BusinessIntegrationSubModel } from '../../../../src/integration/models';

class BusinessIntegrationSubsNotInstalledFixture extends BaseFixture {
  private readonly model: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e169',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',

      enabled: false,
      installed: true,
    } as any);
  }
}

export = BusinessIntegrationSubsNotInstalledFixture;
