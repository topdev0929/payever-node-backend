import { Global, Injectable } from '@nestjs/common';

import { AppSubscriptionEventsEnum } from '../enums';
import { AppSubscriptionModel } from '../models';
import { BaseEventsProducer } from './base-events.producer';

@Global()
@Injectable()
export class AppSubscriptionEventsProducer extends BaseEventsProducer {
  public async appInstalledEvent(
    appSubscription: AppSubscriptionModel,
  ): Promise<void> {
    await this.sendEvent(
      AppSubscriptionEventsEnum.appInstalled,
      {
        ...appSubscription.toObject(),
        app: {
          _id: appSubscription.appId,
        },
        business: {
          _id: appSubscription.businessId,
        },
      },
    );
  }

  public async appUninstalledEvent(
    appSubscription: AppSubscriptionModel,
  ): Promise<void> {
    await this.sendEvent(
      AppSubscriptionEventsEnum.appUninstalled,
      {
        ...appSubscription.toObject(),
        app: {
          _id: appSubscription.appId,
        },
        business: {
          _id: appSubscription.businessId,
        },
      },
    );
  }
}
