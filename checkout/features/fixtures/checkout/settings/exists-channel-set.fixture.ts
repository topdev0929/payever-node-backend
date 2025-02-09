import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business/models';
import { ChannelSetModel } from '../../../../src/channel-set/models';
import { CheckoutModel, CheckoutSectionModel } from '../../../../src/checkout/models';
import { ConnectionModel } from '../../../../src/connection/models';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../src/integration/models';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  ChannelSetSchemaName,
  CheckoutSchemaName,
  ConnectionSchemaName,
  IntegrationSchemaName, SectionSchemaName,
} from '../../../../src/mongoose-schema';
import {
  BusinessFactory,
  BusinessIntegrationSubFactory,
  CheckoutFactory,
  IntegrationFactory, IntegrationId, SectionFactory,
} from '../../../fixture-factories';
import { ChannelSetFactory } from '../../../fixture-factories/channel-set.factory';
import { ConnectionFactory } from '../../../fixture-factories/connection.factory';
import { BusinessInterface } from '../../../../src/business/interfaces';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private connectionModel: Model<ConnectionModel> = this.application.get(getModelToken(ConnectionSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private checkoutSectionModel: Model<CheckoutSectionModel> = this.application.get(
    getModelToken(SectionSchemaName),
  );

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';
    const channelSetId: string = 'a084c7a1-3954-439a-ac42-45e7218cd512';
    const connectionIdOne: string = '4ca57652-6881-4b54-9c11-ce00c79fcb45';
    const connectionIdTwo: string = 'ce00c79f-6881-4b54-cb45-4ca576529c11';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);
    const checkout: CheckoutModel = await this.createCheckout(business, checkoutId, true);

    const integrationOne: IntegrationModel =
      await this.integrationModel.create(IntegrationFactory.createSantanderFactoringDePaymentIntegration());

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

    await this.createSubscription(business, integrationOne);
    const connectionOne: ConnectionModel = await this.createConnection(business, integrationOne, connectionIdOne, 'TestConnectionOne');
    checkout.connections.push(connectionOne);
    const connectionTwo: ConnectionModel = await this.createConnection(business, payExIntegration, connectionIdTwo, 'TestConnectionTwo');
    checkout.connections.push(connectionTwo);

    const channelSet: ChannelSetModel
      = await this.channelSetModel.create(ChannelSetFactory.create(
      {
          _id: channelSetId,
          checkout: checkout.id,
          type: 'link',
        }) as any);
    business.channelSets.push(channelSet as any);

    await checkout.save();
    await business.save();
  }

  private async createCheckout(
    business: BusinessModel,
    checkoutId: string,
    checkoutDefault: boolean,
  ): Promise<CheckoutModel> {
    const checkout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
      default: checkoutDefault,
      name: `Checkout`,

      connections: [],
    }) as any);

    await this.checkoutSectionModel.create(SectionFactory.createDefaultSections());

    business.checkouts.push(checkout as any);

    return checkout;
  }

  private async createSubscription(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<void> {
    await this.businessSubscriptionModel.create(
      BusinessIntegrationSubFactory.create({
        businessId: business._id,
        integration: integration.toObject(),

        installed: true,
      }) as any,
    );
  }

  private async createConnection(
    business: BusinessModel,
    integration: IntegrationModel,
    connectionId: string,
    connectionName: string = null,
  ): Promise<ConnectionModel> {
    let connectionData: any;
    const partialData: any = {
      _id: connectionId,
      businessId: business._id,
      integration: integration.toObject(),
    };

    if (connectionName) {
      partialData.name = connectionName;
      connectionData = ConnectionFactory.create(partialData);
    } else {
      connectionData = ConnectionFactory.create(partialData);
      delete connectionData.name;
    }

    return this.connectionModel.create(connectionData);
  }
}

export = TestFixture;
