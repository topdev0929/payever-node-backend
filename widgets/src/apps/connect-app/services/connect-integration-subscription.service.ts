import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectIntegrationSubscriptionModel } from '../models';
import { Model } from 'mongoose';
import { ConnectIntegrationSubscriptionSchemaName } from '../schemas';
import { ConnectIntegrationSubscriptionInterface } from '../interfaces';

@Injectable()
export class ConnectIntegrationSubscriptionService {
  constructor(
    @InjectModel(ConnectIntegrationSubscriptionSchemaName)
    private readonly connectIntegrationSubscriptionModel: Model<ConnectIntegrationSubscriptionModel>,
  ) { }

  public async findInstalledByBusiness(businessId: string): Promise<ConnectIntegrationSubscriptionModel[]> {
    return this.connectIntegrationSubscriptionModel.find(
      {
        businessId: businessId,
        installed: true,
      },
    );
  }

  public async findOneAndUpdate(
    subscriptionId: string,
    data: ConnectIntegrationSubscriptionInterface,
  ): Promise<ConnectIntegrationSubscriptionModel> {
    return this.connectIntegrationSubscriptionModel.findOneAndUpdate(
      { _id: subscriptionId },
      {
        $set: {
          businessId: data.businessId,
          installed: data.installed,
          integration: data.integration,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteById(integrationSubscriptionId: string): Promise<void> {
    await this.connectIntegrationSubscriptionModel.deleteOne(
      { _id: integrationSubscriptionId },
    ).exec();
  }
}
