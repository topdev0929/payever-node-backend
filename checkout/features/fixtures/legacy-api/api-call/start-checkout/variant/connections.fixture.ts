import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ConnectionModel } from '../../../../../../src/connection/models';
import { ConnectionSchemaName } from '../../../../../../src/mongoose-schema';

class ConnectionsFixture extends BaseFixture {
  private readonly model: Model<ConnectionModel> =
    this.application.get(getModelToken(ConnectionSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '12345f9d-4567-4b45-22eb-867a0a6e08d8',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      integration: '044aace0-866c-4221-b37a-dccf9a8c5cd5',
      name: 'Paypal main',

      options: {
        acceptFee: true,
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
  }
}

export = ConnectionsFixture;
