import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrationSubscriptionInterface } from '../interfaces';
import { BusinessLocalModel } from '../../business/models';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { IntegrationSubscriptionSchemaName } from '../schemas';
import { EventDispatcher } from '@pe/nest-kit';
import { IntegrationSubscriptionEvent } from '../enums/integration-subscribtion.events.enum';

@Injectable()
export class IntegrationSubscriptionService {
  private logger: Logger = new Logger(IntegrationSubscriptionService.name, true);

  constructor(
    @InjectModel(IntegrationSubscriptionSchemaName)
      private readonly subscriptionModel: Model<IntegrationSubscriptionModel>,
    private readonly dispatcher: EventDispatcher,
  ) {
  }

  public async install(
    integration: IntegrationModel,
    business: BusinessLocalModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: true },
      { new: true },
    ).exec();
    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async uninstall(
    integration: IntegrationModel,
    business: BusinessLocalModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: false, enabled: false },
      { new: true },
    ).exec();
    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async removeAllIntegrationSubscriptionsOfBusiness(business: BusinessLocalModel): Promise<void> {
    const integrationSubscriptions: IntegrationSubscriptionModel[] = await this
      .getSubscriptionsWithIntegrations(business);

    for (const subscription of integrationSubscriptions) {
      this.logger.log('subscription ' + subscription);
      await subscription.remove();
    }
  }

  public async getSubscriptionsWithIntegrations(business: BusinessLocalModel): Promise<IntegrationSubscriptionModel[]> {
    await business.populate('integrationSubscriptions').execPopulate();
    for (const subscription of business.integrationSubscriptions) {
      await subscription.populate('integration').execPopulate();
    }

    return business.integrationSubscriptions;
  }

  public async findOneByIntegrationAndBusiness(
    integration: IntegrationModel,
    business: BusinessLocalModel,
  ): Promise<IntegrationSubscriptionModel> {

    return this.findOrCreateSubscription(integration, business);
  }

  public async enable(
    subscription: IntegrationSubscriptionModel,
    business: BusinessLocalModel,
  ): Promise<IntegrationSubscriptionModel> {
    this.logger.log(`integration installed ${subscription}`);
    await subscription.populate('integration').execPopulate();
    await this.dispatcher.dispatch(
      IntegrationSubscriptionEvent.IntegrationSubscribed,
      { business, integrationSub: subscription },
    );

    await this.dispatcher.dispatch(
      IntegrationSubscriptionEvent.ThirdPartyEnabled,
      business,
    );

    return this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { enabled: true },
      { new: true },
    );
  }

  public async disable(subscription: IntegrationSubscriptionModel): Promise<IntegrationSubscriptionModel> {

    return this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { enabled: false },
      { new: true },
    );
  }

  public async findById(id: string): Promise<IntegrationSubscriptionModel> {

    return this.subscriptionModel.findOne({ _id: id });
  }

  public async findOrCreateSubscription(
    integration: IntegrationModel,
    business: BusinessLocalModel,
  ): Promise<IntegrationSubscriptionModel> {
    await business.populate('integrationSubscriptions').execPopulate();
    let subscription: IntegrationSubscriptionModel = business.integrationSubscriptions
      .find((record: IntegrationSubscriptionModel) => record.integration === integration.id);
    if (!subscription) {
      const subscriptionDto: IntegrationSubscriptionInterface = {
        enabled: integration.enabled || false,
        installed: false,
        integration,
      };
      subscription = await this.subscriptionModel.create(subscriptionDto as IntegrationSubscriptionModel);
      business.integrationSubscriptions.push(subscription);
      await business.save();
    }
    await subscription.populate('integration').execPopulate();

    return subscription;
  }
}
