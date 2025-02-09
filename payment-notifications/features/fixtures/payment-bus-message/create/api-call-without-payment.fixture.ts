import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ApiCallModel } from '../../../../src/payment-notifications/models';
import { ApiCallSchemaName } from '../../../../src/payment-notifications/schemas';
import { ApiCallFactory } from '../../../fixture-factories/api-call.factory';

class TestFixture extends BaseFixture {
  private apiCallModel: Model<ApiCallModel> =
    this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const apiCallId: string = '88879e63-d3a8-4547-8d3d-7797dc217bd0';

    const apiCall: ApiCallModel = await this.apiCallModel
      .create(ApiCallFactory.create({
        _id: apiCallId,
      }));
  }
}

export = TestFixture;
