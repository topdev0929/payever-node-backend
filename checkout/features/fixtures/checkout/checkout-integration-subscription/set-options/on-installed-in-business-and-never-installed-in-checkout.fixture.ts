import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel, BusinessInterface } from '../../../../../src/business';
import { CheckoutModel } from '../../../../../src/checkout';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  CheckoutSchemaName,
  IntegrationSchemaName,
} from '../../../../../src/mongoose-schema';
import {
  BusinessFactory,
  BusinessIntegrationSubFactory,
  CheckoutFactory,
  IntegrationFactory,
} from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const integration: IntegrationModel = await this.integrationModel.create(
      IntegrationFactory.createSantanderFactoringDePaymentIntegration(),
    );

    await this.businessSubscriptionModel.create(
      BusinessIntegrationSubFactory.create({
        businessId: business._id,
        integration: integration.toObject(),

        enabled: true,
        installed: true,
      }) as any,
    );

    await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
    }) as any);
  }
}

export = TestFixture;
