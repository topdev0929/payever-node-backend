import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessSchemaName } from '../schemas';
import { IntegrationSubscriptionModel } from '../../integration/models';
import { BusinessLocalModel } from '../models';

@Injectable()
export class BusinessLocalService {

  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessLocalModel>,
  ) { }

  public async findOneById(businessUuid: string): Promise<BusinessLocalModel> {
    return this.businessModel.findOne({ _id: businessUuid });
  }

  public async activeIntegrationSubscriptions(business: BusinessLocalModel): Promise<IntegrationSubscriptionModel[]> {
    business = await this.populateIntegrations(business);

    return business.integrationSubscriptions.filter(
      (subscription: IntegrationSubscriptionModel) => subscription.installed
        && subscription.enabled,
    );
  }

  public async addIntegrationSubscription(
    business: BusinessLocalModel,
    subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessLocalModel> {
    business.set({ integrationSubscriptions: business.integrationSubscriptions.push(subscription._id)});
    await business.save();

    return business;
  }

  public async populateIntegrations(business: BusinessLocalModel): Promise<BusinessLocalModel> {
    const query: any = {
      path: 'integrationSubscriptions',
      populate: [{
        path: 'integration',
      }],
    };
    await business.populate(query).execPopulate();
    
    return business;
  }

  public async getBusinessByIntegrationSubscription(integrationSub: IntegrationSubscriptionModel)
  : Promise<BusinessLocalModel> {
    return this.businessModel.findOne({
      $in: {
        integrationSubscriptions: [integrationSub],
      },
    });
  }
}
