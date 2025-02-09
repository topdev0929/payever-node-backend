import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { CheckoutModel } from '../../../../../src/checkout/models';
import { CheckoutSchemaName } from '../../../../../src/mongoose-schema';

class CheckoutsFixture extends BaseFixture {
  private readonly model: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '04206b2a-a318-40e7-b031-32bbbd879c74',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      default: true,
      name: 'Test',

      connections: [
        '765228ec-afb0-4465-b471-83e8521a4ef3',
        'aaa794cc-6dbd-4087-aaed-fc37817cb919',
        '0a6e4af8-c75a-4196-9712-c9dddf540d3d',
        '2dd4d7e2-3e6d-44fc-a78b-7acfa2977794',
      ],

      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e170',
        '000f3eba-1c84-465f-bb75-811ab402e172',
        '12e5e546-e3e7-4f07-b9e8-4d84ae718c35',
      ],
      settings: {
        callbacks: {
          cancelUrl: 'https://callback.com/canceled/--CALL-ID--',
        },
      },
      subscriptions: [],
    } as any);

    await this.model.create({
      _id: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      name: 'Shopware test',

      connections: [
        '765228ec-afb0-4465-b471-83e8521a4ef3',
        'aaa794cc-6dbd-4087-aaed-fc37817cb919',
        '0a6e4af8-c75a-4196-9712-c9dddf540d3d',
        '2dd4d7e2-3e6d-44fc-a78b-7acfa2977794',
      ],

      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e171',
        '000f3eba-1c84-465f-bb75-811ab402e173',
        'fa2f508f-9f84-4753-9b86-3afd59d1fa6d',
      ],
      subscriptions: [],
    } as any);
  }
}

export = CheckoutsFixture;
