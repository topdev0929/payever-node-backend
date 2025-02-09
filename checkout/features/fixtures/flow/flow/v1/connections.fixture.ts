import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ConnectionModel } from '../../../../../src/connection/models';
import { ConnectionSchemaName } from '../../../../../src/mongoose-schema';

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
        sortOrder: 1,
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
      _id: '2dd4d7e2-3e6d-44fc-a78b-7acfa2977794',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '459891bb-78e3-413e-b874-acbdcaef85d6',
      name: 'Santander DE',

      options: {
        acceptFee: false,
        shippingAddressAllowed: false,
        shippingAddressEquality: false,
        sortOrder: 2,
      },
    } as any);

    await this.model.create({
      _id: '0a6e4af8-c75a-4196-9712-c9dddf540d3d',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: 'a63d3d8b-9166-4b69-b508-a0bbfba63416',
      name: 'Twilio',

      options: {
      },
    } as any);
  }
}

export = ConnectionsFixture;
