import { AbstractStateFixture } from '@pe/pact-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { IntegrationModel, IntegrationSubscriptionModel } from '@pe/third-party-sdk';

export class BusinessExistsHasEbayAndConnectedWithExternalIdState extends AbstractStateFixture {

  private readonly businessModel: Model<BusinessModel>
    = this.application.get('BusinessModel');

  private readonly subscriptionModel: Model<IntegrationSubscriptionModel>
    = this.application.get('ThirdPartySubscriptionModel');

  private readonly thirdPartyModel: Model<IntegrationModel>
    = this.application.get('ThirdPartyModel');

  public async apply(): Promise<void> {
    await this.thirdPartyModel.create({
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'amazon',
      category: 'products',
    } as any);

    const subscription: IntegrationSubscriptionModel = await this.subscriptionModel.create({
      thirdparty: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      externalId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    } as any);

    const b = await this.businessModel.create({
      subscriptions: [subscription],
    } as BusinessModel);
  }

  public getStateName(): string {
    return 'Business exists, has ebay subscription and connected with external id';
  }
}
