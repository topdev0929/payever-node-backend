import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { FolderItemLocationDocument, FolderItemLocation, ScopeEnum } from '@pe/folders-plugin';
import { TransactionModel } from '../../../src/transactions/models';
import {
  TransactionSchemaName,
} from '../../../src/transactions/schemas';
import { PaymentStatusesEnum } from '../../../src/transactions/enum';
import { transactionFactory } from '../factories';

const transactionId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const businessId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const userId: string = '08a3fac8-43ef-4998-99aa-cabc97a39261';
const businessOptionId: number = 1;
const paymentFlowId: string = '2';

class TransactionsFixture extends BaseFixture {

  private readonly transactionModel: Model<TransactionModel> =
    this.application.get(getModelToken(TransactionSchemaName));
  private readonly folderItemLocationModel: Model<FolderItemLocationDocument> =
    this.application.get(getModelToken(FolderItemLocation.name));

  public async apply(): Promise<void> {

    await this.transactionModel.create(transactionFactory.create({
      uuid: transactionId,
      business_uuid : businessId,
      user_uuid: userId,
      business_option_id: businessOptionId,
      payment_flow_id: paymentFlowId,
      channel_set_uuid: '7c2298a7-a172-4048-8977-dbff24dec100',
      channel: 'pos',
      reference: 'f3d44333-21e2-4f0f-952b-72ac2dfb8fc9',
      type: 'payex_creditcard',
      amount: 50,
      total: 50,
      customer_name : 'Customer Test',
      customer_email : 'test@test.com',
      merchant_name : `Test Merchant`,
      merchant_email : `testcases@merchant.com`,
      delivery_fee: 2,
      shipping_method_name: 'some shipping name',
      shipping_order_id: '5db105b8-2da6-421e-8e6a-1c67048cda2b',
      status: PaymentStatusesEnum.Paid,
      specific_status: 'Test specific status',
      original_id: '440ec879-7f02-48d4-9ffb-77adfaf79a06',
    }));

    await this.folderItemLocationModel.create({
      folderId: '79b8cba1-76e9-43d7-964e-399ac6ae6bde',
      itemId: transactionId,
      scope: ScopeEnum.Business,
    });
  }
}

export = TransactionsFixture;
