import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShopModel } from '../interfaces/entities';
import { Model } from 'mongoose';
import { ShopSchemaName } from '../schemas';
import { CreateShopDto } from '../dto';
import { DomainUpdateDto } from '../dto/domain-update.dto';
import { SetDefaultShopDto } from '../dto/set-default-shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(ShopSchemaName) private readonly shopModel: Model<ShopModel>,
  ) { }

  public async create(
    dto: CreateShopDto,
  ): Promise<ShopModel> {
    return  this.upsert(dto);
  }

  public async removeById(shopId: string): Promise<ShopModel> {
    return this.shopModel.findOneAndDelete({ _id: shopId });
  }

  public async upsert(dto: CreateShopDto): Promise<ShopModel> {
    return this.shopModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: {
          business: dto.business.id as any,
          ...dto.domain && {
            domain: dto.domain,
          },
          isDefault: dto.default,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async updateDomain(dto: DomainUpdateDto): Promise<ShopModel> {
    return this.shopModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: {
          domain: dto.newDomain,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async getDefaultShopByBusiness(business: string): Promise<ShopModel> {
    return this.shopModel.findOne({
      business,
      isDefault: true,
    });
  }

  public async setDefaultShop(dto: SetDefaultShopDto): Promise<ShopModel> {
    const defShop: ShopModel = await this.getDefaultShopByBusiness(dto.businessId);
    defShop.isDefault = false;
    await defShop.save();

    return this.shopModel.findOneAndUpdate(
      {
        _id: dto.shopId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
    );
  }
}
