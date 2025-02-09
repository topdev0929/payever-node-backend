import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { OrderModel } from '../../../../src/legacy-api/models';
import { OrderSchemaName } from '../../../../src/mongoose-schema';
import { OrderFactory } from '../../../fixture-factories/order.factory';

class TestFixture extends BaseFixture {
  private orderModel: Model<OrderModel> = this.application.get(getModelToken(OrderSchemaName));

  public async apply(): Promise<void> {
    const orderId: string = '5bececc2-dd47-4a3e-8b85-d1e10d019332';

    const order: OrderModel = await this.orderModel.create(OrderFactory.create({
      _id: orderId,
    }) as any);
  }
}

export = TestFixture;
