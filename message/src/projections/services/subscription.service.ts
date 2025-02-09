import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Query } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { IntercomService } from '@pe/nest-kit';
import { BusinessService, BusinessModel } from '@pe/business-kit';
import { SubscriptionDocument, IntegrationDocument } from '../models';
import { SubscriptionSchemaName } from '../schema/subscription.schema';
import { IntegrationService } from './integration.service';
import { environment } from '../../environments';
import { AxiosError } from 'axios';

export class SubscriptionService {
  constructor(
    @InjectModel(SubscriptionSchemaName)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
    private readonly businessService: BusinessService<BusinessModel>,
    private readonly integrationService: IntegrationService,
    private readonly intercomService: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async getAll(businessId: string): Promise<any[]> {
    const result: any = await (
      await this.intercomService.get(
        `${environment.thirdPartyMessengerMicroUrl}/api/business/${businessId}/subscription/category/messaging`
      )
    )
      .toPromise()
      .catch((error: AxiosError) => {
        this.logger.error({
          context: 'SubscriptionService.getAll',
          error: error.message,
        });
      });

    const subscriptions: any[] = result?.data ?? [];

    for (const subscription of subscriptions) {
      const info: any = await this.getInfo(subscription.integration.name, subscription.authorizationId)
        .catch((e: any) => {
          this.logger.error({
            context: 'SubscriptionService.getInfo',
            error: e,
            subscription: subscription,
          });
        });
      subscription.info = info;
    }

    return subscriptions;
  }

  public async getSubscriptionByIntegrationCodeAndBusinessId(options: {
    businessId: string;
    code: string;
  }): Promise<SubscriptionDocument> {
    const business: BusinessModel = await this.businessService.findOneById(options.businessId);
    if (!business) {
      return null;
    }

    const integrations: IntegrationDocument[] = await this.integrationService.find({
      name: options.code,
    }).exec();

    if (!integrations.length) {
      return null;
    }

    const integration: IntegrationDocument = integrations[0];

    const existingSubscription: SubscriptionDocument = await this.subscriptionModel.findOne({
      business: options.businessId,
      integration: integration._id,
    }).exec();

    if (!existingSubscription) {
      return this.subscriptionModel.create({
        _id: uuid(),
        business: options.businessId,
        enabled: Boolean(integration.autoEnable),
        installed: false,
        integration: integration._id,
      });
    } else {
      return existingSubscription;
    }
  }

  public find(filter: FilterQuery<SubscriptionDocument>): Query<SubscriptionDocument[], SubscriptionDocument> {
    return this.subscriptionModel.find(filter);
  }

  public async install(subscription: SubscriptionDocument): Promise<SubscriptionDocument> {
    subscription.installed = true;
    await subscription.save();

    return subscription;
  }

  public async uninstall(subscription: SubscriptionDocument): Promise<SubscriptionDocument> {
    subscription.installed = false;
    await subscription.save();

    return subscription;
  }

  public async enable(subscription: SubscriptionDocument): Promise<void> {
    subscription.enabled = true;
    await subscription.save();
  }

  public async disable(subscription: SubscriptionDocument): Promise<void> {
    subscription.enabled = false;
    await subscription.save();
  }

  private async getInfo(code: string, authId: string): Promise<any> {
    const integrationMap: { [key: string]: string } = {
      'facebook-messenger': `${environment.facebookMessengerMicroUrl}/api/credentials/${authId}`,
      'instagram-messenger': `${environment.instagramMessengerMicroUrl}/api/credentials/${authId}`,
      'whatsapp': `${environment.whatsappMicroUrl}/api/credentials/${authId}`,
    };

    const url: string = integrationMap[code];
    if (!url) {
      return { };
    }

    const result: any = await (
      await this.intercomService.get(url)
    ).toPromise();

    return result.data;
  }
}
