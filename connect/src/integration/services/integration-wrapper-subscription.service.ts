import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessModelLocal } from '../../business';
import { IntegrationWrapperConfigs } from '../config';
import { IntegrationWrapperConfigInterface } from '../interfaces';
import { IntegrationModel, IntegrationSubscriptionModel, IntegrationWrapperSubscriptionModel } from '../models';
import { IntegrationWrapperSubscriptionSchemaName } from '../schemas';
import { IntegrationSubscriptionService } from './integration-subscription.service';
import { IntegrationService } from './integration.service';

@Injectable()
export class IntegrationWrapperSubscriptionService {
  constructor(
    @InjectModel(IntegrationWrapperSubscriptionSchemaName)
    private readonly integrationWrapperModel: Model<IntegrationWrapperSubscriptionModel>,
    private readonly integrationService: IntegrationService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
    private readonly logger: Logger,
  ) { }

  public async install(
    wrapperType: string,
    business: BusinessModelLocal,
  ): Promise<IntegrationWrapperSubscriptionModel> {
    return this.integrationWrapperModel
      .findOneAndUpdate(
        { businessId: business._id, wrapperType: wrapperType },
        {
          $set: {
            installed: true,
          },
          $setOnInsert: {
            _id: uuid(),
          },
        },
        { new: true, upsert: true },
      ).exec();
  }

  public async uninstall(
    wrapperModel: IntegrationWrapperSubscriptionModel,
    business: BusinessModelLocal,
  ): Promise<IntegrationWrapperSubscriptionModel> {
    return this.integrationWrapperModel
      .findOneAndUpdate(
        {
          businessId: business._id,
          wrapperType: wrapperModel.wrapperType,
        },
        {
          $set: { installed: false },
          $unset: { payload: '' },
        },
        { new: true },
      ).exec();
  }

  public async getWrapperByTypeAndBusiness(
    wrapperType: string,
    businessId: string,
    populateWrappedIntegrations: boolean = true,
  ): Promise<any> {
    const wrapperConfig: IntegrationWrapperConfigInterface = IntegrationWrapperConfigs.find(
      (iwc: any) => iwc.wrapperType === wrapperType,
    );

    if (!wrapperConfig?._id) {
      return { };
    }

    const wrapperModel: IntegrationWrapperSubscriptionModel =
      await this.integrationWrapperModel.findOne({
        businessId: businessId,
        wrapperType: wrapperType,
      }).exec();

    if (populateWrappedIntegrations) {
      const integrations: IntegrationModel[] = await this.integrationService.findByWrapperType(wrapperType);
      const wrappedIntegrations: any[] = [];
      for (const integration of integrations) {
        const subscription: IntegrationSubscriptionModel =
          await this.integrationSubscriptionService.findSubscription(integration._id, businessId);
        wrappedIntegrations.push({
          ...integration.toObject(),
          installed: !!subscription?.installed,
        });
      }

      return {
        ...wrapperConfig,
        businessId: businessId,
        installed: !!wrapperModel?.installed,
        wrappedIntegrations: wrappedIntegrations,
      };
    }

    return {
      ...wrapperConfig,
      businessId: businessId,
      installed: !!wrapperModel?.installed,
    };

  }

  public async getWrapperConfigByType(
    wrapperType: string,
  ): Promise<IntegrationWrapperConfigInterface> {
    return IntegrationWrapperConfigs.find(
      (iwc: any) => iwc.wrapperType === wrapperType,
    );
  }
}
