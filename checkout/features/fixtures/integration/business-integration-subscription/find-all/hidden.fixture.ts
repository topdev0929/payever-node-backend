import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business/models';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  IntegrationSchemaName,
} from '../../../../../src/mongoose-schema';
import {
  BusinessFactory,
  BusinessIntegrationSubFactory,
  IntegrationFactory,
  IntegrationId,
} from '../../../../fixture-factories';
import { BusinessInterface } from '../../../../../src/business/interfaces';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const integrations: IntegrationModel[] = await this.integrationModel.create(
      IntegrationFactory.createPaymentsIntegrations(),
    );

    const payExIntegration: IntegrationModel = await this.integrationModel.create(
      {
        _id : IntegrationId.PayEx,
        category: 'payments',
        displayOptions: {
          _id: 'c468193d-26a9-446b-b4ce-3459041ce61a',
          icon: '#icon-payment-option-payex',
          title: 'integrations.payments.payex.title',
        },
        isVisible: false,
        name: 'payex_creditcard',
      } as any,
    );

    integrations.push(payExIntegration);

    for (const integration of integrations) {
      await this.businessSubscriptionModel.create(
        BusinessIntegrationSubFactory.create({
          businessId: business._id,
          integration: integration.toObject(),

          enabled: true,
          installed: true,
      }) as any,
    );
    }
  }
}

export = TestFixture;
