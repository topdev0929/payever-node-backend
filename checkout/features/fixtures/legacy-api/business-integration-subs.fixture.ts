import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessIntegrationSubModel } from '../../../src/integration';
import { BusinessIntegrationSubSchemaName } from '../../../src/mongoose-schema';

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
      _id: '000f3eba-1c84-465f-bb75-811ab402e167',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: 'ac20b0eb-0583-4f8a-81d4-b55598a04cbf',
      
      enabled: true,
      installed: true,
    } as any);
    
    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e166',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '690276a5-053e-4f9c-b40d-a95cffc81056',
      
      enabled: true,
      installed: true,
    } as any);
    
    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e165',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '246472f7-554f-4822-a5ce-ece1fe6edcf1',
      
      enabled: true,
      installed: true,
    } as any);
    
  }
}

export = BusinessIntegrationSubsFixture;
