import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { OrderStatusEnum } from '../../../src/inventory/enums';
import { OrderModel } from '../../../src/inventory/models';
import { OrderFactory } from '../factories';

const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
const ORDER_ID_1: string = 'oooooooo-oooo-oooo-oooo-ooooooooooo1';
const ORDER_ID_2: string = 'oooooooo-oooo-oooo-oooo-ooooooooooo2';


class AdminOrderFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID_1,
      id: BUSINESS_ID_1,
      name: 'Test business 1',
      companyAddress: { },
      companyDetails: { },
      contactDetails: { }
    } as any);

    await this.businessModel.create({
      _id: BUSINESS_ID_2,
      id: BUSINESS_ID_2,
      name: 'Test business 2',
      companyAddress: { },
      companyDetails: { },
      contactDetails: { }
    } as any);
    
    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID_1,
      businessId: BUSINESS_ID_1,
      flow: "flow",
      transaction: "transaction",
      reservations: [],
      status: OrderStatusEnum.TEMPORARY,
    }));

    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID_2,
      businessId: BUSINESS_ID_2,
      flow: "flow",
      transaction: "transaction",
      reservations: [],
      status: OrderStatusEnum.TEMPORARY,
    }));
  }
  
}

export = AdminOrderFixture;
