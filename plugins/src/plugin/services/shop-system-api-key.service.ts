import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKeyDto } from '../dto';
import { ShopSystemModel } from '../models';
import { ShopSystemSchemaName } from '../schemas';

@Injectable()
export class ShopSystemApiKeyService {
  public constructor(
    @InjectModel(ShopSystemSchemaName) private readonly shopSystemModel: Model<ShopSystemModel>,
  ) { }

  public async create(
    shopSystem: ShopSystemModel,
    apiKeyDto: ApiKeyDto,
  ): Promise<void> {
    if (shopSystem.apiKeys.find((record: string) => record === apiKeyDto.id)) {
      return;
    }

    await this.shopSystemModel.update(
      { _id: shopSystem.id },
      { $push: { apiKeys: apiKeyDto.id } },
    ).exec();
  }

  public async findAllByShopSystem(
    shopSystem: ShopSystemModel,
  ): Promise<string[]> {
    return shopSystem.apiKeys;
  }

  public async deleteAllByShopSystem(
    shopSystem: ShopSystemModel,
  ): Promise<void> {
    await this.shopSystemModel.update(
      { _id: shopSystem.id },
      { $pull: { apiKeys: { $exists: true } } },
    ).exec();
  }

  public async deleteOneById(apiKeyId: string): Promise<void> {
    const shopSystem: ShopSystemModel = await this.shopSystemModel.findOne({ apiKeys: apiKeyId }).exec();
    if (!shopSystem) {
      return;
    }

    await this.shopSystemModel.update(
      { _id: shopSystem.id },
      { $pull: { apiKeys: apiKeyId } },
    ).exec();
  }
}
