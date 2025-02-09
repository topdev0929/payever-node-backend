import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { OrderModel } from '../../../src/inventory/models';
import { OrderFactory } from '../factories';
import { OrderStatusEnum } from '../../../src/inventory/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ORDER_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class UpdateOrderTemporaryNoFlowFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID,
      businessId: BUSINESS_ID,
      flow: null,
      status: OrderStatusEnum.TEMPORARY,
    }) as any);
  }
}

export = UpdateOrderTemporaryNoFlowFixture;
