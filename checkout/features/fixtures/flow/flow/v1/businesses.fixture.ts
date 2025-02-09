import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel, BusinessDetailModel } from '../../../../../src/business/models';
import { BusinessSchemaName, BusinessDetailSchemaName } from '../../../../../src/mongoose-schema';

class BusinessesFixture extends BaseFixture {
  private readonly model: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly businessDetailsModel: Model<BusinessDetailModel> =
    this.application.get(getModelToken(BusinessDetailSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '012c165f-8b88-405f-99e2-82f74339a757',
      businessDetail: 'deae756c-93a0-49d1-89af-2a9a379a049e',
      country: 'DE',
      currency: 'EUR',
      name: 'Test business',
      slug: 'test-business',

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
        '47b35666-596a-43a3-96c1-336c5a2dcdaa',
      ],
      integrationSubscriptions: [],
    } as any);

    await this.model.create({
      _id: '4b4218b8-1b9a-48ea-baf9-e30bc543c276',
      businessDetail: '76ffdfbb-4961-413e-b42d-34f39d9f136b',
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
        '47b35666-596a-43a3-96c1-336c5a2dcdaa',
      ],
      integrationSubscriptions: [],
    } as any);

    await this.businessDetailsModel.create({
      _id: 'deae756c-93a0-49d1-89af-2a9a379a049e',
      bankAccount: {
        iban: 'test_iban',
      },
      companyAddress: {
        city: 'Hamburg',
        country: 'DE',
        street: 'Qwerty',
        zipCode: '12345',
      },
    });
    await this.businessDetailsModel.create({
      _id: '76ffdfbb-4961-413e-b42d-34f39d9f136b',
      bankAccount: {
        iban: 'test_iban',
      },
      companyAddress: {
        city: 'Hamburg',
        country: 'DE',
        street: 'Qwerty',
        zipCode: '12345',
      },
    });
  }
}

export = BusinessesFixture;
