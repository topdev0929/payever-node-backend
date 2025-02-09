import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { CheckoutModel } from '../../../../../src/checkout';
import { BusinessSchemaName, CheckoutSchemaName } from '../../../../../src/mongoose-schema';
import { BusinessFactory, CheckoutFactory } from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';
    const defaultCheckoutId: string = '49b19f50-48de-b3d2-ee1a-8d49b19f5054';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const checkout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
      default: false,
      logo: 'Existing checkout logo',
      name: 'Existing checkout name',
    }) as any);
    business.checkouts.push(checkout  as any);

    const defaultCheckout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: defaultCheckoutId,
      businessId: business.id,
      default: true,
      logo: 'Default checkout logo',
      name: 'Default checkout name',
    }) as any);
    business.checkouts.push(defaultCheckout as any);

    await business.save();
  }
}

export = TestFixture;
