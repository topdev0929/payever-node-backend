import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture, SequenceGenerator } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business/models';
import { CheckoutModel } from '../../../../../src/checkout/models';
import { ConnectionModel } from '../../../../../src/connection/models';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration/models';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
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
import { ConnectionFactory } from '../../../../fixture-factories/connection.factory';
import { BusinessInterface } from '../../../../../src/business/interfaces';

class TestFixture extends BaseFixture {
  private sequence: SequenceGenerator = new SequenceGenerator();
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private connectionModel: Model<ConnectionModel> = this.application.get(getModelToken(ConnectionSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutIdOne: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';
    const checkoutIdTwo: string = '184a8e77-ee1a-48de-b3d2-8d49b19f5054';
    const connectionId: string = '4ca57652-6881-4b54-9c11-ce00c79fcb45';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const integration: IntegrationModel =
      await this.integrationModel.create(IntegrationFactory.createSantanderFactoringDePaymentIntegration());

    await this.businessSubscriptionModel.create(
      BusinessIntegrationSubFactory.create({
        businessId: business._id,
        integration: integration.toObject(),

        installed: true,
      }) as any,
    );

    const connection: ConnectionModel = await this.connectionModel.create(
      ConnectionFactory.create({
        _id: connectionId,
        businessId: business._id,
        integration: integration.toObject(),
        name: 'Connection One',
      }) as any,
    );

    await this.createCheckout(business, checkoutIdOne, true, connection);
    await this.createCheckout(business, checkoutIdTwo, false, connection);
  }

  private async createCheckout(
    business: BusinessModel,
    checkoutId: string,
    checkoutDefault: boolean,
    connection: ConnectionModel,
  ): Promise<void> {
    this.sequence.next();
    const checkout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
      default: checkoutDefault,
      name: `Checkout ${this.sequence.current}`,

      connections: [connection],
    }) as any);

    business.checkouts.push(checkout  as any);
    await business.save();
  }
}

export = TestFixture;
