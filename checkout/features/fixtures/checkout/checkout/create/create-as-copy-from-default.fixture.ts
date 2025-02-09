import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { CheckoutIntegrationSubModel, CheckoutModel, CheckoutSectionModel } from '../../../../../src/checkout';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchemaName,
  IntegrationSchemaName,
  SectionSchemaName,
} from '../../../../../src/mongoose-schema';
import {
  BusinessFactory,
  BusinessIntegrationSubFactory,
  CheckoutFactory,
  CheckoutIntegrationSubFactory,
  IntegrationFactory,
  SectionFactory,
} from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private checkoutSubscriptionModel: Model<CheckoutIntegrationSubModel> = this.application.get(
    getModelToken(CheckoutIntegrationSubSchemaName),
  );
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));
  private checkoutSectionModel: Model<CheckoutSectionModel> = this.application.get(
    getModelToken(SectionSchemaName),
  );

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';

    const integrationOne: IntegrationModel = await this.integrationModel.create(
      IntegrationFactory.createSantanderFactoringDePaymentIntegration(),
    );
    const integrationTwo: IntegrationModel = await this.integrationModel.create(
      IntegrationFactory.createDhlShippingIntegration(),
    );
    const integrationThree: IntegrationModel = await this.integrationModel.create(
      IntegrationFactory.createTwilioCommunicationIntegration(),
    );

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    await this.createBusinessIntegrationSub(business, integrationOne);
    await this.createBusinessIntegrationSub(business, integrationTwo);
    await this.createBusinessIntegrationSub(business, integrationThree);
    await business.save();

    const checkout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
      default: true,
    }) as any);

    await this.createCheckoutIntegrationSub(checkout, integrationOne);
    await this.createCheckoutIntegrationSub(checkout, integrationTwo);
    await this.createCheckoutIntegrationSub(checkout, integrationThree);
    await checkout.save();

    await this.checkoutSectionModel.create(SectionFactory.createDefaultSections());

    business.checkouts.push(checkout  as any);
    await business.save();
  }

  private async createBusinessIntegrationSub(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<BusinessIntegrationSubModel> {
    return this.businessSubscriptionModel.create(
      BusinessIntegrationSubFactory.create({
        businessId: business._id,
        integration: integration.toObject(),

        enabled: true,
        installed: true,
      }) as any,
    );
  }

  private async createCheckoutIntegrationSub(
    checkout: CheckoutModel,
    integration: IntegrationModel,
  ): Promise<CheckoutIntegrationSubModel> {
    return this.checkoutSubscriptionModel.create(
      CheckoutIntegrationSubFactory.create({
        checkout: checkout.toObject() as never,
        integration: integration.toObject(),

        installed: true,
      }) as any,
    );
  }
}

export = TestFixture;
