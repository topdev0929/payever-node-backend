/* tslint:disable:object-literal-sort-keys */
import { BaseFixture } from '@pe/cucumber-sdk';
import { TransactionModel } from '../../../src/transactions/models';
import { transactionFactory } from '../factories';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionSchemaName } from '../../../src/transactions/schemas';

const transactionId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const businessId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const businessOptionId: string = '1';
const paymentFlowId: string = '2';

class RunActionsSantanderSeFixture extends BaseFixture {

  private readonly transactionModel: Model<TransactionModel> =
    this.application.get(getModelToken(TransactionSchemaName));

  public async apply(): Promise<void> {

    await this.transactionModel.create(transactionFactory.create({
      uuid: transactionId,
      business_uuid : businessId,
      merchant_name: 'Test merchant',
      business_option_id: businessOptionId,
      payment_flow_id: paymentFlowId,
      channel_set_uuid: '7c2298a7-a172-4048-8977-dbff24dec100',
      reference: 'f3d44333-21e2-4f0f-952b-72ac2dfb8fc9',
      type: 'santander_installment_se',
    }));
  }
}

export = RunActionsSantanderSeFixture;
