import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../../../../../src/checkout';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchemaName,
  IntegrationSchemaName,
} from '../../../../../src/mongoose-schema';
import {
  BusinessFactory,
  BusinessIntegrationSubFactory,
  CheckoutFactory,
  CheckoutIntegrationSubFactory,
  IntegrationFactory,
  IntegrationId,
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

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const shippingIntegrations: IntegrationModel[] = await this.integrationModel.create(
      IntegrationFactory.createShippingsIntegrations(),
    );
    await this.createBusinessIntegrationSubs(business, shippingIntegrations);

    const paymentIntegrations: IntegrationModel[] = await this.integrationModel.create(
      IntegrationFactory.createPaymentsIntegrations(),
    );
    const businessIntegrationSubs: BusinessIntegrationSubModel[] =
      await this.createBusinessIntegrationSubs(business, paymentIntegrations);
    await this.installSomeBusinessIntegrationSubs(businessIntegrationSubs);
    await this.enableSomeBusinessIntegrationSubs(businessIntegrationSubs);

    const checkout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
    }) as any);
    business.checkouts.push(checkout  as any);
    await business.save();

    const checkoutIntegrationSubs: BusinessIntegrationSubModel[] =
      await this.createCheckoutIntegrationSubs(checkout, paymentIntegrations);
    await this.installSomeCheckoutIntegrationSubs(checkoutIntegrationSubs);
  }

  private async createBusinessIntegrationSubs(
    business: BusinessModel,
    integrations: IntegrationModel[],
  ): Promise<BusinessIntegrationSubModel[]> {
    const tasks: Array<Promise<BusinessIntegrationSubModel>> = [];
    for (const integration of integrations) {
      tasks.push(
        this.businessSubscriptionModel.create(
          BusinessIntegrationSubFactory.create({
            businessId: business._id,
            integration: integration.toObject(),
          }) as any,
        ),
      );
    }

    return Promise.all(tasks);
  }

  private async installSomeBusinessIntegrationSubs(
    businessIntegrationSubs: BusinessIntegrationSubModel[],
  ): Promise<void> {
    const tasks: Array<Promise<BusinessIntegrationSubModel>> = [];
    let installedSub: BusinessIntegrationSubModel;

    installedSub = businessIntegrationSubs.find(
      (x: BusinessIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderFactoringDe,
    );
    installedSub.installed = true;
    tasks.push(installedSub.save());

    installedSub = businessIntegrationSubs.find(
      (x: BusinessIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderInstallment,
    );
    installedSub.installed = true;
    tasks.push(installedSub.save());

    installedSub = businessIntegrationSubs.find(
      (x: BusinessIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderCppInstallment,
    );
    installedSub.installed = true;
    tasks.push(installedSub.save());

    installedSub = businessIntegrationSubs.find(
      (x: BusinessIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderInvoiceDe,
    );
    installedSub.installed = true;
    tasks.push(installedSub.save());

    await Promise.all(tasks);
  }

  private async enableSomeBusinessIntegrationSubs(
    businessIntegrationSubs: BusinessIntegrationSubModel[],
  ): Promise<void> {
    const tasks: Array<Promise<BusinessIntegrationSubModel>> = [];
    let installedSub: BusinessIntegrationSubModel;

    installedSub = businessIntegrationSubs.find(
      (x: BusinessIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderFactoringDe,
    );
    installedSub.enabled = true;
    tasks.push(installedSub.save());

    installedSub = businessIntegrationSubs.find(
      (x: BusinessIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderInstallment,
    );
    installedSub.enabled = true;
    tasks.push(installedSub.save());

    await Promise.all(tasks);
  }

  private async createCheckoutIntegrationSubs(
    checkout: CheckoutModel,
    integrations: IntegrationModel[],
  ): Promise<CheckoutIntegrationSubModel[]> {
    const tasks: Array<Promise<CheckoutIntegrationSubModel>> = [];
    for (const integration of integrations) {
      tasks.push(
        this.checkoutSubscriptionModel.create(
          CheckoutIntegrationSubFactory.create({
            checkout: checkout.toObject() as never,
            integration: integration.toObject(),
          }) as any,
        ),
      );
    }

    return Promise.all(tasks);
  }

  private async installSomeCheckoutIntegrationSubs(
    checkoutIntegrationSubs: CheckoutIntegrationSubModel[],
  ): Promise<void> {
    const tasks: Array<Promise<CheckoutIntegrationSubModel>> = [];
    let installedSub: CheckoutIntegrationSubModel;

    installedSub = checkoutIntegrationSubs.find(
      (x: CheckoutIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderFactoringDe,
    );
    installedSub.installed = true;
    tasks.push(installedSub.save());

    installedSub = checkoutIntegrationSubs.find(
      (x: CheckoutIntegrationSubModel) => x.toObject().integration as any === IntegrationId.SantanderInstallment,
    );
    installedSub.installed = true;
    tasks.push(installedSub.save());

    await Promise.all(tasks);
  }
}

export = TestFixture;
