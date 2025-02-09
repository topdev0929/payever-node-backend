import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../business';
import { AppliedToEnum, AppRegistryEventNameEnum, SubscriberEligibilityEnum } from '../enums';
import { SubscriptionNetworkModel } from '../models';
import { SubscriptionNetworkService, SubscriptionPlanService } from '../services';
import { RabbitChannelsEnum } from '../../environments';
import { AppRegistryInstalledRmqMessageDto } from '../dto';
const SUBSCRIPITONS_APP_CODE: string = 'subscriptions';

@Controller()
export class AppRegistryConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly subscriptionNetworkService: SubscriptionNetworkService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: AppRegistryEventNameEnum.ApplicationInstalled,
  })
  public async appInstalled(data: AppRegistryInstalledRmqMessageDto): Promise<void> {

    const business: BusinessModel = await this.businessService.findOneById(data.businessId) as BusinessModel;

    if (data.code !== SUBSCRIPITONS_APP_CODE || !business) {
      return;
    }

    const subscriptionNetwork: SubscriptionNetworkModel[] =
    await this.subscriptionNetworkService.getByBusiness(business);

    if (subscriptionNetwork && subscriptionNetwork.length) {
      return;
    }

    const defaultNetwork: SubscriptionNetworkModel = await this.subscriptionNetworkService.create(
      business, { name: business.name, isDefault: true } as any,
    );

    await this.subscriptionPlanService.create(
      {
        appliesTo: AppliedToEnum.ALL_PRODUCTS,
        isDefault: true,
        name: 'Start Plan',
        subscribersEligibility: SubscriberEligibilityEnum.EVERYONE,
        subscriptionNetwork: defaultNetwork._id,
      } as any,
      business,
    );
  }
}
