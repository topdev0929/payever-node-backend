import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { OrderModel } from '../../../src/inventory/models';
import { OrderFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class GetOrdersByBusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    for (let i: number = 1; i <= 3; i++) {
      await this.orderModel.create(OrderFactory.create({
        businessId: BUSINESS_ID,
      }) as any);
    }
  }
}

export = GetOrdersByBusinessFixture;
