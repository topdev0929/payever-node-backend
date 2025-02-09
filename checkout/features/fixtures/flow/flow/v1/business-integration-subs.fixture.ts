import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessIntegrationSubModel } from '../../../../../src/integration/models';
import { BusinessIntegrationSubSchemaName } from '../../../../../src/mongoose-schema';

class BusinessIntegrationSubsFixture extends BaseFixture {
  private readonly model: Model<BusinessIntegrationSubModel> =
    this.application.get(getModelToken(BusinessIntegrationSubSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e169',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',

      enabled: true,
      installed: true,
    } as any);

    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e168',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '459891bb-78e3-413e-b874-acbdcaef85d6',

      enabled: true,
      installed: true,
    } as any);

    await this.model.create({
      _id: '47b35666-596a-43a3-96c1-336c5a2dcdaa',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: 'a63d3d8b-9166-4b69-b508-a0bbfba63416',

      enabled: true,
      installed: true,
    } as any);
  }
}

export = BusinessIntegrationSubsFixture;
