import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { IntegrationModel, IntegrationSubscriptionModel } from '../../integration/models';
import { IntegrationService } from '../../integration/services';
import { BusinessSchemaName  } from '@pe/business-kit';
import { PopulateInterface } from '../interfaces';
import { BusinessModel } from '../models';

@Injectable()
export class BusinessServiceLocal {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly integrationService: IntegrationService,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async activeIntegrationSubscriptions(business: BusinessModel): Promise<IntegrationSubscriptionModel[]> {
    business = await this.populateIntegrations(business);

    return business.integrationSubscriptions.filter(
      (subscription: IntegrationSubscriptionModel) => subscription.installed
        && subscription.enabled,
    );
  }

  public async addIntegrationSubscription(
    business: BusinessModel,
    subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessModel> {
    business.set({ integrationSubscriptions: business.integrationSubscriptions.push(subscription._id)});
    await business.save();

    return business;
  }

  public async populateIntegrations(business: BusinessModel, exceptCustom: boolean = false): Promise<BusinessModel> {
    const customIntegration: IntegrationModel = await this.integrationService.findOneByName('custom');

    const query: PopulateInterface = {
      path: 'integrationSubscriptions',
      populate: [{
        path: 'integration',
      }, {
        path: 'rules',
      }],
    };
    if (exceptCustom) {
      query.match = { integration: { $ne: customIntegration._id }};
    }
    await business.populate(query).execPopulate();

    return business;
  }

  public async getBusinessByIntegrationSubscription(integrationSub: IntegrationSubscriptionModel)
  : Promise<BusinessModel> {
    return this.businessModel.findOne({
      $in: {
        integrationSubscriptions: [integrationSub],
      },
    });
  }
}
