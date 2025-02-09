import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { BusinessIntegrationSubSchemaName, BusinessSchemaName } from '../../mongoose-schema';
import { BusinessIntegrationSubInterface } from '../interfaces';
import { BusinessIntegrationSubModel, IntegrationModel } from '../models';

@Injectable()
export class BusinessIntegrationSubscriptionService {
  constructor(
    @InjectModel(BusinessSchemaName) private businessModel: Model<BusinessModel>,
    @InjectModel(BusinessIntegrationSubSchemaName) private subscriptionModel: Model<BusinessIntegrationSubModel>,
  ) { }

  public async install(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<BusinessIntegrationSubModel> {
    const subscription: BusinessIntegrationSubModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: BusinessIntegrationSubModel = await this.subscriptionModel.findOneAndUpdate(
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
  ): Promise<BusinessIntegrationSubModel> {
    const subscription: BusinessIntegrationSubModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: BusinessIntegrationSubModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: false },
      { new: true },
    );

    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async findByBusinessAndCategory(
    business: BusinessModel,
    category: string,
  ): Promise<BusinessIntegrationSubModel[]> {
    const subscriptions: BusinessIntegrationSubModel[] =
      await this.subscriptionModel.find({ businessId: business.id }).populate('integration');

    const filtered: BusinessIntegrationSubModel[] = subscriptions.filter(
      (sub: BusinessIntegrationSubModel) => sub.integration !== null && sub.integration.category === category,
    );

    return this.sortSubscriptions(filtered);
  }

  public async hasPosInstalled(
    business: BusinessModel,
  ): Promise<boolean> {
    const subscriptions: BusinessIntegrationSubModel[] =
      await this.subscriptionModel.find({ businessId: business.id }).populate('integration');

    return subscriptions.some(
      (sub: BusinessIntegrationSubModel) => {
        return sub.integration !== null && sub.integration.name === 'pos' && sub.installed;
      }
    );
  }

  public async findByBusiness(business: BusinessModel): Promise<BusinessIntegrationSubModel[]> {
    const subscriptions: BusinessIntegrationSubModel[] =
      await this.subscriptionModel.find({ businessId: business.id }).populate('integration');

    const filtered: BusinessIntegrationSubModel[] = subscriptions.filter(
      (sub: BusinessIntegrationSubModel) => sub.integration !== null,
    );

    return this.sortSubscriptions(filtered);
  }

  public async findInstalledAndEnabledIntegrations(business: BusinessModel): Promise<IntegrationModel[]> {
    const businessSubscriptions: BusinessIntegrationSubModel[] =
      await this.findByBusiness(business);

    return businessSubscriptions
      .filter((sub: BusinessIntegrationSubModel) => sub.installed && sub.enabled)
      .map((sub: BusinessIntegrationSubModel) => sub.integration);
  }

  public async findOneByIntegrationAndBusiness(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<BusinessIntegrationSubModel> {
    return this.findOrCreateSubscription(integration, business);
  }

  public async enable(
    subscription: BusinessIntegrationSubModel,
  ): Promise<BusinessIntegrationSubModel> {
    return this.subscriptionModel.findOneAndUpdate(
      {
        _id: subscription.id,
        installed: true,
      },
      { enabled: true },
      { new: true },
    );
  }

  public async disable(
    subscription: BusinessIntegrationSubModel,
  ): Promise<BusinessIntegrationSubModel> {
    return this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { enabled: false },
      { new: true },
    );
  }

  public async deleteOneById(id: string): Promise<void> {
    await this.subscriptionModel.deleteOne({ _id: id });
  }

  public async filterByVisibleIntegrations(
    subs: BusinessIntegrationSubModel[],
  ): Promise<BusinessIntegrationSubModel[]> {
    return subs.filter((subscription: BusinessIntegrationSubModel) => subscription.integration.isVisible);
  }

  private async findOrCreateSubscription(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<BusinessIntegrationSubModel> {
    let subscription: BusinessIntegrationSubModel = await this.subscriptionModel.findOne({
      businessId: business.id,
      integration: integration.id,
    });

    if (!subscription) {
      try {
        const subscriptionDto: BusinessIntegrationSubInterface = {
          businessId: business._id,
          integration: integration,

          enabled: false,
          installed: false,
        };

        subscription = await this.subscriptionModel.create(subscriptionDto as BusinessIntegrationSubModel);
      } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          subscription = await this.subscriptionModel.findOne({
            business: business.id,
            integration: integration.id,
          });
        } else {
          throw error;
        }
      }
    }

    await subscription.populate('integration').execPopulate();

    return subscription;
  }

  private sortSubscriptions(subscriptions: BusinessIntegrationSubModel[]): BusinessIntegrationSubModel[] {
    return subscriptions.sort((a: BusinessIntegrationSubModel, b: BusinessIntegrationSubModel) => {
      if (a.integration.name < b.integration.name) {
        return -1;
      }
      if (a.integration.name > b.integration.name) {
        return 1;
      }

      return 0;
    });
  }
}
