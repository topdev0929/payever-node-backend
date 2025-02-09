/* eslint-disable object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { FlowModel } from '../../../../../src/flow/models';
import { FlowSchemaName } from '../../../../../src/mongoose-schema/schemas/flow';
import { FlowInterface } from '../../../../../src/flow/interfaces';
import { FlowStatesEnum } from '../../../../../src/flow/enum';

class FlowFixture extends BaseFixture {
  private readonly model: Model<FlowModel> = this.application.get(getModelToken(FlowSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: 'f83e581c-4e99-4f66-adb5-0f6dd5230579',
      amount: 200,
      currency: 'DKK',
      reference: 'test_ref',
      total: 200,
      state: FlowStatesEnum.inProgress,
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      channelSetId: '006388b0-e536-4d71-b1f1-c21a6f1801e6',
      apiCallId: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
      disableValidation: true,
      billingAddress: {
        country: 'DE',
        city: 'Hamburg',
        zipCode: '12345',
        street: 'Test 12',
        firstName: 'Test',
        lastName: 'Test',

      },
    } as FlowInterface);
  }
}

export = FlowFixture;
