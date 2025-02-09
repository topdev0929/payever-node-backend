import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { Model } from 'mongoose';
import { MarketplaceInterface } from '../interfaces';
import { MarketplaceModel } from '../models';
import { MarketplaceSchemaName } from '../schemas';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(MarketplaceSchemaName) private readonly marketplaceModel: Model<MarketplaceModel>,
    private readonly mutex: Mutex,
  ) { }

  public async updateOrCreate(id: string, data: MarketplaceInterface): Promise<MarketplaceModel> {
    return this.mutex.lock(
      'products-marketplace',
      id,
      async () => this.marketplaceModel.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { upsert: true, new: true },
      ),
    );
  }

  public async deleteOneById(id: string): Promise<MarketplaceModel> {
    return this.marketplaceModel.findOneAndDelete({ _id: id });
  }

  public async getBusinessMarketplaces(businessId: string): Promise<MarketplaceModel[]> {
    return this.marketplaceModel.find({ businessId }).populate('subscription');
  }

  public async findMany(ids: string[]): Promise<MarketplaceModel[]> {
    return this.marketplaceModel.find({ _id: { $in: ids } });
  }

  public async getBusinessMarketplaces2(businessId: string): Promise<MarketplaceInterface[]> {
    return this.marketplaceModel
      .find({ businessId })
      .populate('subscription')
      .lean();
  }
}
