import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionSchemaName } from '../schemas';
import { SubscriptionModel } from '../models';
import { Model } from 'mongoose';
import { SubscriptionInterface, MarketplaceInterface } from '../interfaces';
import { MarketplaceService } from './marketplace.service';
import { IntegrationExported } from '../dto';
import { MarketplaceTypeEnum } from '../enums';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(SubscriptionSchemaName) private readonly subscriptionModel: Model<SubscriptionModel>,
    private readonly marketplaceService: MarketplaceService,
  ) { }

  public async updateOrCreate(subscription: SubscriptionInterface): Promise<SubscriptionModel> {
    const subscriptionModel: SubscriptionModel = await this.subscriptionModel
      .findOne({ name: subscription.name, businessId: subscription.businessId })
      .exec();

    if (subscriptionModel) {
      subscriptionModel.set(subscription);

      return subscriptionModel.save();
    }

    return this.subscriptionModel.create(subscription);
  }

  public async deleteOneById(id: string): Promise<SubscriptionModel> {
    return this.subscriptionModel.findOneAndDelete({ _id: id });
  }

  public async importSubscription(dto: IntegrationExported): Promise<void> {
    const subscriptionModel: SubscriptionModel = await this.updateOrCreate(dto as SubscriptionInterface);
    const marketplace: MarketplaceInterface = {
      businessId: dto.businessId,
      subscription: subscriptionModel._id,
      type: MarketplaceTypeEnum.MARKET,
    };
    await this.marketplaceService.updateOrCreate(subscriptionModel.id, marketplace);
  }

  public async updateOrCreateSubsciption(subscription: SubscriptionInterface): Promise<SubscriptionModel> {
    const subscriptionModel: SubscriptionModel = await this.updateOrCreate(subscription);
    const marketplace: MarketplaceInterface = {
      businessId: subscriptionModel.businessId,
      subscription: subscriptionModel._id,
      type: MarketplaceTypeEnum.MARKET,
    };
    await this.marketplaceService.updateOrCreate(subscriptionModel.id, marketplace);

    return subscriptionModel;
  }
}
