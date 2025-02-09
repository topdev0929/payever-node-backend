import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { SubscriptionNetworkService, SubscriptionPlanService } from '../services';
import { SubscriptionNetworkModel } from '../models';
import { BusinessModel } from '../../business';
import { AppliedToEnum, SubscriberEligibilityEnum } from '../enums';

@Injectable()
export class BusinessListener {
  constructor(
    private readonly subscriptionNetworkService: SubscriptionNetworkService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void> {
    await this.createDefaultFromEvent(business);
  }

  @EventListener(BusinessEventsEnum.BusinessExport)
  public async onBusinessExported(business: BusinessModel): Promise<void> {
    await this.createDefaultFromEvent(business);
  }

  private async createDefaultFromEvent(business: BusinessModel): Promise<void> {
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
