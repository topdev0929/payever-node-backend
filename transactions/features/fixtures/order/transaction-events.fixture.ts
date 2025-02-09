import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderFactory } from '../factories';
import { OrderModel } from '../../../src/orders/models';
import { OrderSchemaName } from '../../../src/orders/schemas';

const orderId: string = 'b0f5c2da-b71b-479c-978f-febc06e0806e';

class TransactionEventsFixture extends BaseFixture {

  private readonly orderModel: Model<OrderModel> =
    this.application.get(getModelToken(OrderSchemaName));

  public async apply(): Promise<void> {

    await this.orderModel.create(OrderFactory.create({
      _id: orderId,
    }));

  }
}

export = TransactionEventsFixture;
