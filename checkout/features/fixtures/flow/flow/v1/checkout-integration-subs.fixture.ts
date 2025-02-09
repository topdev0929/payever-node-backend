import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { CheckoutIntegrationSubModel } from '../../../../../src/checkout/models';
import { CheckoutIntegrationSubSchemaName } from '../../../../../src/mongoose-schema';

class BusinessIntegrationSubsFixture extends BaseFixture {
  private readonly model: Model<CheckoutIntegrationSubModel> =
    this.application.get(getModelToken(CheckoutIntegrationSubSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e170',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',

      installed: true,
    } as any);

    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e171',
      checkout: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',

      installed: true,
    } as any);

    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e172',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      integration: '459891bb-78e3-413e-b874-acbdcaef85d6',

      installed: true,
    } as any);

    await this.model.create({
      _id: '000f3eba-1c84-465f-bb75-811ab402e173',
      checkout: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      integration: '459891bb-78e3-413e-b874-acbdcaef85d6',

      installed: true,
    } as any);

    await this.model.create({
      _id: 'fa2f508f-9f84-4753-9b86-3afd59d1fa6d',
      checkout: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      integration: 'a63d3d8b-9166-4b69-b508-a0bbfba63416',

      installed: true,
    } as any);

    await this.model.create({
      _id: '12e5e546-e3e7-4f07-b9e8-4d84ae718c35',
      checkout: '04206b2a-a318-40e7-b031-32bbbd879c74',
      integration: 'a63d3d8b-9166-4b69-b508-a0bbfba63416',

      installed: true,
    } as any);
  }
}

export = BusinessIntegrationSubsFixture;
