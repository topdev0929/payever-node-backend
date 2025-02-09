import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { BusinessIntegrationSubSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { IntegrationSubscriptionInterface } from '../interfaces';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';

@Injectable()
export class BusinessIntegrationSubscriptionService {
  constructor(
    @InjectModel(BusinessIntegrationSubSchemaName)
      private readonly subscriptionModel: Model<IntegrationSubscriptionModel>,
  ) { }

  public async install(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: true },
      { new: true },
    );

    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async uninstall(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: false },
      { new: true },
    );

    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async findOneById(id: string): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.subscriptionModel.findById(id);
    await subscription.populate('integration').execPopulate();

    return subscription;
  }

  public async findByCategory(business: BusinessModel, category?: string): Promise<IntegrationSubscriptionModel[]> {
    await business.populate('integrationSubscriptions').execPopulate();

    const subscriptions: IntegrationSubscriptionModel[] = [];
    for (const subscription of business.integrationSubscriptions) {
      await subscription.populate('integration').execPopulate();
      if (subscription.integration && (!category || subscription.integration.category === category)) {
        subscriptions.push(subscription);
      }
    }

    return subscriptions.sort((a: IntegrationSubscriptionModel, b: IntegrationSubscriptionModel) => {
      if (a.integration.name < b.integration.name) {
        return -1;
      }
      if (a.integration.name > b.integration.name) {
        return 1;
      }

      return 0;
    });
  }

  public async getSubscriptionsWithIntegrations(business: BusinessModel): Promise<IntegrationSubscriptionModel[]> {
    await business.populate('integrationSubscriptions').execPopulate();
    for (const subscription of business.integrationSubscriptions) {
      await subscription.populate('integration').execPopulate();
    }

    return business.integrationSubscriptions;
  }

  public async findOneByIntegrationAndBusiness(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    return this.findOrCreateSubscription(integration, business);
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await business.populate('integrationSubscriptions').execPopulate();
    for (const subscription of business.integrationSubscriptions) {
      await this.subscriptionModel.deleteOne({ _id: subscription.id });
    }
  }

  private async findOrCreateSubscription(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    await business.populate('integrationSubscriptions').execPopulate();

    let subscription: IntegrationSubscriptionModel = business.integrationSubscriptions
      .find((record: IntegrationSubscriptionModel) => record.integration === integration.id);

    if (!subscription) {
      const subscriptionDto: IntegrationSubscriptionInterface = {
        installed: false,
        integration: integration,
      };

      subscription = await this.subscriptionModel.create(subscriptionDto as IntegrationSubscriptionModel);
      business.integrationSubscriptions.push(subscription);
      await business.save();
    }

    await subscription.populate('integration').execPopulate();

    return subscription;
  }
}
