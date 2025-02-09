import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MarketplaceAssigmentSchemaName } from '../schemas';
import { MarketplaceAssigmentModel, SubscriptionModel } from '../models';
import { Model } from 'mongoose';
import { MarketplaceAssigmentInterface } from '../interfaces';

@Injectable()
export class MarketplaceAssigmentService {
  constructor(
    @InjectModel(MarketplaceAssigmentSchemaName)
    private readonly marketplaceAssigmentModel: Model<MarketplaceAssigmentModel>,
  ) { }

  public async create(marketplaceAssigment: MarketplaceAssigmentInterface): Promise<MarketplaceAssigmentModel> {
    return this.marketplaceAssigmentModel.create(marketplaceAssigment);
  }

  public async createMany(
    marketplaceAssigments: MarketplaceAssigmentInterface[],
  ): Promise<MarketplaceAssigmentModel[]> {
    return this.marketplaceAssigmentModel.create(marketplaceAssigments);
  }

  public async findByProductUuid(productUuid: string): Promise<MarketplaceAssigmentModel[]> {
    return this.marketplaceAssigmentModel.find({ productUuid });
  }

  public async removeSubscription(subscription: SubscriptionModel): Promise<void> {
    await this.marketplaceAssigmentModel.deleteMany({ marketplaceId: subscription._id });
  }

  public async removeMany(productUuid: string, marketplaceIds: string[]): Promise<void> {
    await this.marketplaceAssigmentModel.deleteMany({ marketplaceId: { $in: marketplaceIds }, productUuid });
  }

  public async removeMarketplacesFromProducts(productUuids: string[], marketplaceIds: string[]): Promise<void> {
    await this.marketplaceAssigmentModel.deleteMany({
      marketplaceId: { $in: marketplaceIds },
      productUuid: { $in: productUuids },
    });
  }

  public async removeAllFromProducts(productUuids: string[]): Promise<void> {
    await this.marketplaceAssigmentModel.deleteMany({ productUuid: { $in: productUuids } });
  }
}
