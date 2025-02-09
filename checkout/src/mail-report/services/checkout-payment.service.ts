import { Injectable } from '@nestjs/common';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { ChannelSetModel } from '../../channel-set';
import {
  CheckoutIntegrationSubModel,
  CheckoutInterface,
} from '../../checkout';
import {
  BusinessIntegrationSubModel,
  BusinessIntegrationSubscriptionService,
  IntegrationCategory,
} from '../../integration';
import { CombinedCheckoutStatInterface, CombinedPaymentOptionsInterface } from '../interfaces';
import { CheckoutDbService, CheckoutIntegrationSubscriptionService } from '../../common/services';

@Injectable()
export class CheckoutPaymentService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly businessIntegrationService: BusinessIntegrationSubscriptionService,
    private readonly checkoutDbService: CheckoutDbService,
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
  ) { }

  public async combineCheckoutStat(businessId: string): Promise<CombinedCheckoutStatInterface> {
    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    const checkouts: CheckoutInterface[] = await this.checkoutDbService.findAllByBusiness(business);
    const checkout: CheckoutInterface[] = checkouts.slice(0, 1);
    const subscriptions: BusinessIntegrationSubModel[] =
      await this.businessIntegrationService.findByBusiness(business);
    const paymentOptions: BusinessIntegrationSubModel[] = subscriptions
      .filter((subscription: BusinessIntegrationSubModel) =>
        subscription.integration.category === IntegrationCategory.Payments && subscription.installed,
      )
      .slice(0, 4)
      .map((item: BusinessIntegrationSubModel) => ({
        ...item.toObject(),
        business: item.businessId,
      } as any))
    ;
    const filteredIntegrations: BusinessIntegrationSubModel[] = subscriptions.filter(
      (subscription: BusinessIntegrationSubModel) => {
        return (subscription.integration.category === IntegrationCategory.Shopsystems
          || subscription.integration.category === IntegrationCategory.Applications
        )
          && subscription.installed;
      },
    );
    const channels: BusinessIntegrationSubModel[] = filteredIntegrations
      .map((subscription: BusinessIntegrationSubModel) => subscription.integration.displayOptions)
      .slice(0, 4)
    ;

    return {
      channels,
      checkout,
      paymentOptions,
    };
  }

  public async combinePaymentOptions(businessId: string): Promise<CombinedPaymentOptionsInterface[]> {
    const channelSet: ChannelSetModel = await this.findActiveChannelSet(businessId);

    if (!channelSet) {
      return [];
    }

    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    await channelSet.populate('checkout').execPopulate();
    const checkoutSubscriptions: CheckoutIntegrationSubModel[] =
      await this.checkoutIntegrationService.getEnabledSubscriptions(channelSet.checkout, business);

    const installedPayments: CheckoutIntegrationSubModel[] = checkoutSubscriptions.filter(
      (subscription: CheckoutIntegrationSubModel) =>
        subscription.integration.category === IntegrationCategory.Payments,
    );

    return installedPayments.map((subscription: CheckoutIntegrationSubModel) => {
      return {
        icon: subscription.integration.displayOptions.icon,
        title: subscription.integration.displayOptions.title,
      };
    });
  }

  public async findActiveChannelSet(businessId: string): Promise<ChannelSetModel> {
    let activeChannelSet: ChannelSetModel = null;
    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    await business.populate('channelSets').execPopulate();

    if (!business.channelSets.length) {
      return activeChannelSet;
    }

    for (const channelSet of business.channelSets) {
      if ((channelSet as ChannelSetModel).active) {
        activeChannelSet = channelSet as ChannelSetModel;
      }
    }

    return activeChannelSet;
  }
}
