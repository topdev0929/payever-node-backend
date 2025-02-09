import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business';
import { ChannelSetModel } from '../../../../src/channel-set';
import { CheckoutIntegrationSubModel, CheckoutModel, CheckoutSectionModel } from '../../../../src/checkout';
import { IntegrationModel } from '../../../../src/integration';
import {
  BusinessSchemaName,
  ChannelSetSchemaName,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchemaName,
  IntegrationSchemaName,
  SectionSchemaName,
} from '../../../../src/mongoose-schema';
// tslint:disable-next-line: no-require-imports
import helper = require('../../fixture-creator-helper');

class TestFixture extends BaseFixture {
  private readonly sectionModel: Model<CheckoutSectionModel> = this.application.get(
    getModelToken(SectionSchemaName),
  );

  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly channelModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private readonly checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private readonly integrationModel: Model<IntegrationModel> = this.application.get(
    getModelToken(IntegrationSchemaName),
  );
  private readonly subscriptionModel: Model<CheckoutIntegrationSubModel> = this.application.get(
    getModelToken(CheckoutIntegrationSubSchemaName),
  );

  public async apply(): Promise<void> {
    helper.checkoutsCreated = 0;
    helper.integrationCreated = 0;

    await helper.createCheckout({
      addChannel: true,
      businessId: 'businessAndChannelDefaultId',
      businessModel: this.businessModel,
      chanelSetModel: this.channelModel,
      checkoutId: 'checkoutId',
      checkoutModel: this.checkoutModel,
      count: 2,
      integrationModel: this.integrationModel,
      isDefault: true,
      nameTemplate: 'payments',
      sectionModel: this.sectionModel,
      subscriptionModel: this.subscriptionModel,
    } as any);
  }
}

export = TestFixture;
