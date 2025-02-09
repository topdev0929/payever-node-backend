import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessModel, BusinessService } from '@pe/business-kit';
import { MessageBusEventsEnum } from '../enums';
import { AppModel } from '../models';
import { AppService, AppSubscriptionService } from '../services';

@Controller()
export class ConnectBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly appService: AppService,
    private readonly appSubscriptionService: AppSubscriptionService,
  ) { }

  @MessagePattern({
    name: MessageBusEventsEnum.ConnectIntegrationSubscriptionCreated,
  })
  public async appSubscriptionCreated(data: any): Promise<void> {

    const business: BusinessModel = await this.businessService.findOneById(data.businessId);

    const app: AppModel = await this.appService.findOne(data.integrationSubscription.integration._id);

    if (business && app) {
      await this.appSubscriptionService.install(business, app);
    }
  }

  @MessagePattern({
    name: MessageBusEventsEnum.ConnectIntegrationSubscriptionUpdated,
  })
  public async appSubscriptionUpdated(data: any): Promise<void> {

    const business: BusinessModel = await this.businessService.findOneById(data.businessId);

    const app: AppModel = await this.appService.findOne(data.integrationSubscription.integration._id);

    if (business && app) {
      if (data.integrationSubscription.installed) {
        await this.appSubscriptionService.install(business, app);
      } else {
        await this.appSubscriptionService.uninstall(business, app);
      }
    }
  }
}
