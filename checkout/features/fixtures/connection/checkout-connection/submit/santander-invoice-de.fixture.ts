import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business/models';
import { ChannelSetModel } from '../../../../../src/channel-set/models';
import { CheckoutModel } from '../../../../../src/checkout/models';
import { ConnectionModel } from '../../../../../src/connection/models';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration/models';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  ChannelSetSchemaName,
  CheckoutSchemaName,
  ConnectionSchemaName,
  IntegrationSchemaName,
} from '../../../../../src/mongoose-schema';
import {
  BusinessFactory,
  BusinessIntegrationSubFactory,
  CheckoutFactory,
  IntegrationFactory,
} from '../../../../fixture-factories';
import { ChannelSetFactory } from '../../../../fixture-factories/channel-set.factory';
import { ConnectionFactory } from '../../../../fixture-factories/connection.factory';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private connectionModel: Model<ConnectionModel> = this.application.get(getModelToken(ConnectionSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';
    const connectionIdOne: string = '4ca57652-6881-4b54-9c11-ce00c79fcb45';
    const channelSetIdOne: string = 'a888336c-fe1f-439c-b13c-f351db6bbc2e';
    const channelSetIdTwo: string = '2c926572-b2ba-41fb-943d-2f941c356ad8';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);
    const checkout: CheckoutModel = await this.createCheckout(business, checkoutId, true);

    const integrationOne: IntegrationModel =
      await this.integrationModel.create(IntegrationFactory.createSantanderInvoiceDePaymentIntegration() as any);
    await this.createSubscription(business, integrationOne);
    const connectionOne: ConnectionModel = await this.createConnection(business, integrationOne, connectionIdOne);
    checkout.connections.push(connectionOne);

    const channelSetOneLink: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdOne,
      checkout: checkout.id,
      type: 'api',
    }) as any);
    business.channelSets.push(channelSetOneLink as any);

    const channelSetTwoLink: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdTwo,
      checkout: checkout.id,
      subType: 'in_store',
      type: 'api',
    }) as any);
    business.channelSets.push(channelSetTwoLink as any);

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

    business.checkouts.push(checkout  as any);

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
  ): Promise<ConnectionModel> {
    return this.connectionModel.create(
      ConnectionFactory.create({
        _id: connectionId,
        businessId: business._id,
        integration: integration.toObject(),
        name: `Connection of ${integration.name}`,
      }) as any,
    );
  }
}

export = TestFixture;
