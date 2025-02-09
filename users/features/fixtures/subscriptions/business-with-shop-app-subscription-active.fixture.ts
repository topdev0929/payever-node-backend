import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessAppInstallationModel, BusinessModel } from '../../../src/user/models';
import { BusinessFactory } from '../factories';
import { AppSubscriptionModel } from '@pe/subscriptions-sdk';

class BusinessWithShopAppSubscriptionActiveFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const installationModel: Model<BusinessAppInstallationModel> = this.application.get('BusinessAppInstallationModel');
    const businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
    const subscriptionModel: Model<AppSubscriptionModel> = this.application.get('AppSubscriptionModel');

    await businessModel.create(
      BusinessFactory.create({
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      }),
    );

    await installationModel.create({
      _id: '11111111-1111-1111-1111-111111111111',
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      code: 'shop',
    });

    await subscriptionModel.create({
      active: true,
      appName: 'shop',
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      subscriptionStartedAt: new Date(),
    });
  }
}

export = BusinessWithShopAppSubscriptionActiveFixture;
