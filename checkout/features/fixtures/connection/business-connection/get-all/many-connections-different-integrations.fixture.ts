import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business/models';
import { ConnectionModel } from '../../../../../src/connection/models';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../../src/integration/models';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  ConnectionSchemaName,
  IntegrationSchemaName,
} from '../../../../../src/mongoose-schema';
import { BusinessFactory, BusinessIntegrationSubFactory, IntegrationFactory } from '../../../../fixture-factories';
import { ConnectionFactory } from '../../../../fixture-factories/connection.factory';
import { BusinessInterface } from '../../../../../src/business/interfaces';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));
  private businessSubscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );
  private connectionModel: Model<ConnectionModel> = this.application.get(getModelToken(ConnectionSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const connectionIdOne: string = '4ca57652-6881-4b54-9c11-ce00c79fcb45';
    const connectionIdTwo: string = 'ce00c79f-6881-4b54-cb45-4ca576529c11';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const integrationOne: IntegrationModel =
      await this.integrationModel.create(IntegrationFactory.createSantanderFactoringDePaymentIntegration());
    await this.createSubscription(business, integrationOne);
    await this.createConnection(business, integrationOne, connectionIdOne);

    const integrationTwo: IntegrationModel =
      await this.integrationModel.create(IntegrationFactory.createDhlShippingIntegration());
    await this.createSubscription(business, integrationTwo);
    await this.createConnection(business, integrationTwo, connectionIdTwo);

    await business.save();
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
