import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business';
import { BusinessSchemaName } from '../../../src/mongoose-schema';

class BusinessesFixture extends BaseFixture {
  private readonly model: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '012c165f-8b88-405f-99e2-82f74339a757',
      currency: 'EUR',
      name: 'Test business',
      slug: 'test-business',

      channelSets: [
        '006388b0-e536-4d71-b1f1-c21a6f1801e6',
        '00019b2d-1340-404f-8152-ab126428ae79',
        '0997aebe-1924-4c29-a221-b2be26f56a15',
      ],
      checkouts: [
        '04206b2a-a318-40e7-b031-32bbbd879c74',
        '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      ],
      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e169',
        '000f3eba-1c84-465f-bb75-811ab402e168',
        '000f3eba-1c84-465f-bb75-811ab402e167',
        '000f3eba-1c84-465f-bb75-811ab402e166',
        '000f3eba-1c84-465f-bb75-811ab402e165',
      ],
      integrationSubscriptions: [],
    } as any);

    await this.model.create({
      _id: '4b4218b8-1b9a-48ea-baf9-e30bc543c276',
      currency: 'EUR',
      name: 'New Test business',

      channelSets: [
        '006388b0-e536-4d71-b1f1-c21a6f1801e6',
        '00019b2d-1340-404f-8152-ab126428ae79',
      ],
      checkouts: [
        '04206b2a-a318-40e7-b031-32bbbd879c74',
        '00ce3fed-80f1-5d0c-8d89-18f25acef2f3',
      ],
      integrationSubs: [
        '000f3eba-1c84-465f-bb75-811ab402e169',
        '000f3eba-1c84-465f-bb75-811ab402e168',
      ],
      integrationSubscriptions: [],
    } as any);
  }
}

export = BusinessesFixture;
