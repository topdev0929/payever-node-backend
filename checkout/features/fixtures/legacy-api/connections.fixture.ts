/* eslint-disable no-duplicate-string */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ConnectionModel } from '../../../src/connection/models';
import { ConnectionSchemaName } from '../../../src/mongoose-schema';

class ConnectionsFixture extends BaseFixture {
  private readonly model: Model<ConnectionModel> =
    this.application.get(getModelToken(ConnectionSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '765228ec-afb0-4465-b471-83e8521a4ef3',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',
      name: 'Paypal main',

      options: {
        acceptFee: true,
        maxAmount: 22000,
        minAmount: 5,
      },
    } as any);

    await this.model.create({
      _id: 'aaa794cc-6dbd-4087-aaed-fc37817cb919',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',
      name: 'Paypal extra',

      options: {
        acceptFee: false,
        shippingAddressAllowed: true,
        shippingAddressEquality: true,
      },
    } as any);

    await this.model.create({
      _id: '8275e4de-c4ed-4b87-a0e3-ebe678385c2a',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '459891bb-78e3-413e-b874-acbdcaef85d6',
      mappedReference: '7f1f7519-7e35-4112-8560-002e40550549',
      name: 'Santander DE',

      options: {
        acceptFee: true,
      },
    } as any);

    await this.model.create({
      _id: '8dca92f8-5b5a-4ef2-af5b-2662812359e9',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '43ef6b23-177f-4f8d-a99f-8893cf34f3fd',
      name: 'Santander Invoice DE',

      options: {
        acceptFee: true,
      },
    } as any);

    await this.model.create({
      _id: 'd97964b0-be02-4bb8-90ed-be15d46bfca6',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: 'edebb298-fd41-4d29-9b9e-633bac416bb8',
      name: 'Zinia BNPL DE',

      options: {
        acceptFee: true,
      },
    } as any);

    await this.model.create({
      _id: '7f1f7519-7e35-4112-8560-002e40550549',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '2415ad0c-87b3-44db-9ce4-fb052f48fea1',
      name: 'Zinia Installment DE',

      options: {
        acceptFee: true,
      },
    } as any);
    
    await this.model.create({
      _id: '99177608-a467-4092-9783-0a93f2de00fb',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: 'ac20b0eb-0583-4f8a-81d4-b55598a04cbf',
      name: 'Santander POS installment',
      
      options: {
        acceptFee: true,
      },
    } as any);
    
    await this.model.create({
      _id: '0dd0ccdd-b785-4634-b655-01fef851c5a3',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '690276a5-053e-4f9c-b40d-a95cffc81056',
      name: 'Santander POS Invoice DE',
      
      options: {
        acceptFee: true,
      },
    } as any);
    
    await this.model.create({
      _id: '2003b322-f6f3-4834-bada-f46cb82f32d8',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '246472f7-554f-4822-a5ce-ece1fe6edcf1',
      name: 'Zinia POS DE',
      
      options: {
        acceptFee: true,
      },
    } as any);
    
  }
}

export = ConnectionsFixture;
