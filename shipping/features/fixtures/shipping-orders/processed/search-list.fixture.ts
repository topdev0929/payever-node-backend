import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ShippingOrderModel } from '../../../../src/shipping/models';
import { Model } from 'mongoose';
import { ShippingOrderSchemaName } from '../../../../src/shipping/schemas';
import { shippingOrderFactory } from '../../factories';
import { BusinessModel } from '../../../../src/business/models';
import { BusinessSchemaName } from '../../../../src/business/schemas';
import { ShippingStatusEnums } from "../../../../src/shipping/enums";

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const TRANSACTION_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class SearchListFixture  extends BaseFixture {
  public async apply(): Promise<void> {
    const businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
    const shippingOrderModel: Model<ShippingOrderModel> = this.application.get(getModelToken(ShippingOrderSchemaName));

    await businessModel.create({
      _id: BUSINESS_ID,
    });

    await shippingOrderModel.create(shippingOrderFactory(
        {
          businessId: BUSINESS_ID,
          status: ShippingStatusEnums.Processed,
        },
    ));

    await shippingOrderModel.create(shippingOrderFactory(
      {
        businessId: BUSINESS_ID,
        status: ShippingStatusEnums.Processed,
        transactionId: TRANSACTION_ID,
      },
    ));

    await shippingOrderModel.create(shippingOrderFactory(
      {
        businessId: BUSINESS_ID,
        status: ShippingStatusEnums.Processed,
        shippingItems: [
          {
            dimensionUnit: 'cm',
            height: 1,
            length: 1,
            name: 'Shipped item name',
            price: 999,
            quantity: 100,
            weight: 1,
            weightUnit: 'kg',
            width: 1,
          },
        ],
      },
    ));

    await shippingOrderModel.create(shippingOrderFactory(
      {
        businessId: ANOTHER_BUSINESS_ID,
        status: ShippingStatusEnums.Processed,
      },
    ));
  }
}

export = SearchListFixture;
