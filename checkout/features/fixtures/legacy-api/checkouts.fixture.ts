import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { CheckoutModel } from '../../../src/checkout';
import { CheckoutSchemaName } from '../../../src/mongoose-schema';

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
        '8275e4de-c4ed-4b87-a0e3-ebe678385c2a',
        '8dca92f8-5b5a-4ef2-af5b-2662812359e9',
        'd97964b0-be02-4bb8-90ed-be15d46bfca6',
        '7f1f7519-7e35-4112-8560-002e40550549',
      ],

      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e170',
        '000f3eba-1c84-465f-bb75-811ab402e172',
        '000f3eba-1c84-465f-bb75-811ab402e174',
        '000f3eba-1c84-465f-bb75-811ab402e175',
        '000f3eba-1c84-465f-bb75-811ab402e176',
      ],
      settings: {
        callbacks: {
          cancelUrl: 'https://callback.com/canceled',
        },
      },
      subscriptions: [],
    } as any);

    await this.model.create({
      _id: '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      name: 'Shopware test',

      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e171',
        '000f3eba-1c84-465f-bb75-811ab402e173',
      ],
      subscriptions: [],
    } as any);

    await this.model.create({
      _id: '2967ef02-6b10-4717-91d7-90e8fd4df76c',
      businessId: '4b4218b8-1b9a-48ea-baf9-e30bc543c276',
      default: true,
      name: 'Test business 2',

      connections: [
        '765228ec-afb0-4465-b471-83e8521a4ef3',
        'aaa794cc-6dbd-4087-aaed-fc37817cb919',
        '8275e4de-c4ed-4b87-a0e3-ebe678385c2a',
        '8dca92f8-5b5a-4ef2-af5b-2662812359e9',
        'd97964b0-be02-4bb8-90ed-be15d46bfca6',
        '7f1f7519-7e35-4112-8560-002e40550549',
      ],

      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e170',
        '000f3eba-1c84-465f-bb75-811ab402e172',
        '000f3eba-1c84-465f-bb75-811ab402e174',
        '000f3eba-1c84-465f-bb75-811ab402e175',
        '000f3eba-1c84-465f-bb75-811ab402e176',
      ],
      settings: {
        callbacks: {
          cancelUrl: 'https://callback.com/canceled',
        },
      },
      subscriptions: [],
    } as any);
  }
}

export = CheckoutsFixture;
