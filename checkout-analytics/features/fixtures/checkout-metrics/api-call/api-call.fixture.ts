import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ApiCallModel } from '../../../../src/checkout-analytics/models';
import { ApiCallSchemaName } from '../../../../src/checkout-analytics/schemas';

class TestFixture extends BaseFixture {
  private apiCallModel: Model<ApiCallModel> =
    this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'd916ec94-3b2e-4728-bce2-3e9b4f9d353d';

    const apiCalls: any[] = [
      {
        _id: '65ceae0a-b810-41b9-907f-923b6f7892a1',
        businessId: businessId,
        status: 'success',

        createdAt: '2021-02-09T09:22:00.000Z',
        updatedAt: '2021-02-09T09:22:00.000Z',
      },
    ];

    await this.apiCallModel.create(apiCalls);
  }
}

export = TestFixture;
