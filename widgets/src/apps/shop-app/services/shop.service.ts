import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShopModel } from '../models';
import { Model } from 'mongoose';
import { ShopEventDto } from '../dto';
import { ShopSchemaName } from '../schemas';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(ShopSchemaName) private readonly shopModel: Model<ShopModel>,
  ) { }

  public async createOrUpdateShopFromEvent(data: ShopEventDto): Promise<ShopModel> {
    const businessId: string = data.business ? data.business.id : null;

    return this.shopModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          businessId,
          default: data.default,
          logo: data.logo,
          name: data.name,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteShop(data: ShopEventDto): Promise<void> {
    await this.shopModel.deleteOne({ _id: data.id }).exec();
  }

  public async getDefaultBusinessShop(businessId: string): Promise<ShopModel> {
    return this.shopModel.findOne({
      businessId,
      default: true,
    });
  }
}
