import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderFactory, transactionFactory } from '../factories';
import { OrderModel } from '../../../src/orders/models';
import { OrderSchemaName } from '../../../src/orders/schemas';
import { TransactionModel } from '../../../src/transactions/models';
import { TransactionSchemaName } from '../../../src/transactions/schemas';

const orderId: string = '915a88b0-1e5b-49df-90a4-6bb1ea29b880';
const businessId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const transactionId1: string = '9aa3da0d-5e37-44f5-ad3e-ca72b4dca42b';
const transactionId2: string = '53ab934e-1fb1-4c7c-b056-4b5fc1f2449b';

class OrderValidateFixture extends BaseFixture {

  private readonly orderModel: Model<OrderModel> =
    this.application.get(getModelToken(OrderSchemaName));
  private readonly transactionModel: Model<TransactionModel> =
    this.application.get(getModelToken(TransactionSchemaName));

  public async apply(): Promise<void> {
    const transaction1: any = await this.transactionModel.create(transactionFactory.create({
      _id: transactionId1,
      business_option_id: 1,
      business_uuid : businessId,
      merchant_name: 'Test merchant',
      payment_flow_id: '2',
      reference: '60f3dac6-9b61-426c-a802-52c14f0d023e',
      total: 50,
      type: 'santander_invoice_de',
      uuid: '96557cd7-e797-4bc9-9f71-bd95251b2611',
    }));
    
    const transaction2: any = await this.transactionModel.create(transactionFactory.create({
      _id: transactionId2,
      business_option_id: 1,
      business_uuid : businessId,
      merchant_name: 'Test merchant',
      payment_flow_id: '2',
      reference: '70e2b829-5984-4377-99f1-9d6c7cb05ca3',
      total: 100,
      type: 'santander_invoice_de',
      uuid: 'd7921be2-a020-41ea-af74-9b35eee64046',
    }));
    
    
    await this.orderModel.create(OrderFactory.create({
      _id: orderId,
      transactions: [
        transaction1,
        transaction2,
      ],
    }));

  }
}

export = OrderValidateFixture;
