import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import {
  BusinessIntegrationSubModel,
  BusinessIntegrationSubscriptionService,
  IntegrationCategory,
  IntegrationModel,
} from '../../integration';
import { CheckoutIntegrationSubSchemaName } from '../../mongoose-schema';
import { CheckoutIntegrationSubInterface } from '../../checkout/interfaces';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../../checkout/models';
import { RabbitEventsProducer } from '../producer';

@Injectable()
export class CheckoutIntegrationSubscriptionService {
  constructor(
    @InjectModel(CheckoutIntegrationSubSchemaName) private subscriptionModel: Model<CheckoutIntegrationSubModel>,
    private businessIntegrationService: BusinessIntegrationSubscriptionService,
    private rabbitEventsProducer: RabbitEventsProducer,
  ) { }

  public async install(
    integration: IntegrationModel,
    checkout: CheckoutModel,
  ): Promise<CheckoutIntegrationSubModel> {
    const subscription: CheckoutIntegrationSubModel = await this.findOrCreateSubscription(integration, checkout);

    const updatedSubscription: CheckoutIntegrationSubModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: true },
      { new: true },
    );

    await this.rabbitEventsProducer.checkoutIntegrationEnabled(integration, checkout);

    return updatedSubscription;
  }

  public async uninstall(
    integration: IntegrationModel,
    checkout: CheckoutModel,
  ): Promise<CheckoutIntegrationSubModel> {
    const subscription: CheckoutIntegrationSubModel = await this.findOrCreateSubscription(integration, checkout);

    const updatedSubscription: CheckoutIntegrationSubModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: false },
      { new: true },
    );

    await this.rabbitEventsProducer.checkoutIntegrationDisabled(integration, checkout);

    return updatedSubscription;
  }

  public async setOptions(
    integration: IntegrationModel,
    checkout: CheckoutModel,
    options: any,
  ): Promise<void> {
    const subscription: CheckoutIntegrationSubModel = await this.findOrCreateSubscription(integration, checkout);

    await this.subscriptionModel.updateOne(
      { _id: subscription.id },
      { options: options },
      { new: true },
    );
  }

  public async getOptions(
    integration: IntegrationModel,
    checkout: CheckoutModel,
  ): Promise<any> {
    const subscription: CheckoutIntegrationSubModel = await this.findOrCreateSubscription(integration, checkout);

    return subscription.options;
  }

  public async deleteOneById(id: string): Promise<void> {
    await this.subscriptionModel.deleteOne({ _id: id });
  }

  public async deleteByCheckout(checkout: CheckoutModel): Promise<void> {
    await this.subscriptionModel.deleteMany({ checkout: checkout });
  }

  public async getSubscriptions(checkout: CheckoutModel): Promise<CheckoutIntegrationSubModel[]> {
    return this.subscriptionModel.find({ checkout: checkout.id });
  }

  public async getSubscriptionsWithIntegrations(checkout: CheckoutModel): Promise<CheckoutIntegrationSubModel[]> {
    return this.subscriptionModel
      .find({ checkout: checkout.id })
      .populate('integration');
  }

  public async getEnabledSubscriptions(
    checkout: CheckoutModel,
    business: BusinessModel,
  ): Promise<CheckoutIntegrationSubModel[]> {
    const checkoutSubscriptions: CheckoutIntegrationSubModel[] =
      await this.getSubscriptionsWithIntegrations(checkout);
    const businessSubscriptions: BusinessIntegrationSubModel[] =
      await this.businessIntegrationService.findByBusiness(business);
    const subscriptionsOutOfCheckoutSubscriptions: BusinessIntegrationSubModel[] =
      businessSubscriptions.filter(
        (sub: CheckoutIntegrationSubModel) => sub.integration.category === IntegrationCategory.Shippings,
      );

    const enabledBusinessIntegrations: IntegrationModel[] =
      await this.businessIntegrationService.findInstalledAndEnabledIntegrations(business);
    const enabledBusinessIntegrationNames: string[] = enabledBusinessIntegrations
      .map((integration: IntegrationModel) => integration.name);

    return [
      ...checkoutSubscriptions.filter(
        (sub: CheckoutIntegrationSubModel) => sub.installed
          && enabledBusinessIntegrationNames.includes(sub.integration.name),
      ),
      ...subscriptionsOutOfCheckoutSubscriptions,
    ] as CheckoutIntegrationSubModel[];
  }

  private async findOrCreateSubscription(
    integration: IntegrationModel,
    checkout: CheckoutModel,
  ): Promise<CheckoutIntegrationSubModel> {
    let subscription: CheckoutIntegrationSubModel = await this.subscriptionModel.findOne({
      checkout: checkout,
      integration: integration,
    });

    if (!subscription) {
      const subscriptionDto: CheckoutIntegrationSubInterface = {
        checkout: checkout,
        installed: false,
        integration: integration,
      };

      subscription = await this.subscriptionModel.create(subscriptionDto as CheckoutIntegrationSubModel);
    }

    await subscription.populate('integration').execPopulate();

    return subscription;
  }
}
