import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessModel } from '@pe/business-kit';
import { AppModel, AppSubscriptionModel } from '../models';
import { AppSubscriptionEventsProducer } from '../producers';
import { AppSubscriptionSchemaName } from '../schemas';

@Injectable()
export class AppSubscriptionService {
  constructor(
    @InjectModel(AppSubscriptionSchemaName)
      private readonly appSubscriptionModel: Model<AppSubscriptionModel>,
    private readonly appSubscriptionEventsProducer: AppSubscriptionEventsProducer,
  ) { }

  public async install(business: BusinessModel, app: AppModel): Promise<AppSubscriptionModel> {
    const appSubscription: AppSubscriptionModel = await this.appSubscriptionModel.findOneAndUpdate(
      {
        appId: app._id,
        businessId: business._id,
      },
      {
        installed: true,
      },
      {
        new: true,
        upsert: true,
      },
    );

    await this.appSubscriptionEventsProducer.appInstalledEvent(appSubscription);

    return appSubscription;
  }

  public async uninstall(business: BusinessModel, app: AppModel): Promise<AppSubscriptionModel> {
    const updatedAppSubscription: AppSubscriptionModel = await this.appSubscriptionModel.findOneAndUpdate(
      {
        appId: app._id,
        businessId: business._id,
      },
      {
        installed: false,
      },
      {
        new: true,
      },
    );

    await this.appSubscriptionEventsProducer.appUninstalledEvent(updatedAppSubscription);

    return updatedAppSubscription;
  }
}
