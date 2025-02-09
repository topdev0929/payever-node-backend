/* eslint-disable object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { CheckoutModel } from '../../../../../src/checkout';
import { BusinessSchemaName, CheckoutSchemaName } from '../../../../../src/mongoose-schema';
import { BusinessFactory, CheckoutFactory } from '../../../../fixture-factories';
import { CheckoutSection } from '../../../../../src/integration';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const checkout: CheckoutModel = await this.checkoutModel.create(
      CheckoutFactory.create(
        {
          _id: checkoutId,
          businessId: business.id,
          default: true,
          sections: [
            {
              _id: '87695a9d-ab32-4fa5-b958-cf637eb6340a',
              code: CheckoutSection.Order,
              order: 0,
              enabled: true,
            } as any,
            {
              _id: '939dfaa7-908e-478a-bc68-1018da075eb6',
              code: CheckoutSection.User,
              order: 1,
              enabled: true,
            },
            {
              _id: '67b70735-bd5c-4894-b17f-1e9e8a7a1515',
              code: CheckoutSection.Address,
              order: 2,
              enabled: true,
            } as any,
            {
              _id: 'aaa84f89-e4b9-47f9-80f9-decf697294ea',
              code: CheckoutSection.ChoosePayment,
              order: 3,
              enabled: true,
            } as any,
            {
              _id: 'dc558619-fa10-4baf-978b-b2c33b1deb82',
              code: CheckoutSection.Payment,
              order: 4,
              enabled: true,
            },
          ],
        },
      ) as any);

    business.checkouts.push(checkout  as any);
    await business.save();
  }
}

export = TestFixture;
