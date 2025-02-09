import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelModel, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../business/schemas';
import { ShopSystemInterface } from '../interfaces';
import { ShopSystemModel } from '../models';
import { ShopSystemSchemaName } from '../schemas';

@Injectable()
export class ShopSystemService {
  public constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
    @InjectModel(ShopSystemSchemaName) private readonly shopSystemModel: Model<ShopSystemModel>,
  ) { }

  public async create(
    channelSet: ChannelSetModel,
    channel: ChannelModel,
    business: BusinessModel,
  ): Promise<ShopSystemModel> {
      const existentShopSystem: ShopSystemModel = await this.findOneByChannelAndBusiness(channel, business);
      if (existentShopSystem) {
        return existentShopSystem;
      }

      const shopSystemDto: ShopSystemInterface = {
        apiKeys: [],
        channel: channel,
        channelSet: channelSet,
      };

      const createdShopSystem: ShopSystemModel = await this.shopSystemModel.create(shopSystemDto as ShopSystemModel);
      business.shopSystems.push(createdShopSystem);
      await business.save();

      return this.findOneById(createdShopSystem._id);
  }

  public async findOneById(shopSystemId: string): Promise<ShopSystemModel> {
      const shopSystem: ShopSystemModel = await this.shopSystemModel.findOne({ _id: shopSystemId }).exec();
      if (!shopSystem) {
        return;
      }

      await shopSystem.populate(`channel`).execPopulate();
      await shopSystem.populate(`channelSet`).execPopulate();

      return shopSystem;
  }

  public async findOneByChannelAndBusiness(
    channel: ChannelModel,
    business: BusinessModel,
  ): Promise<ShopSystemModel> {
    await business.populate(`shopSystems`).execPopulate();
    const shopSystem: ShopSystemModel = business.shopSystems.find(
      (record: ShopSystemModel) => record.channel === channel._id,
    );
    if (!shopSystem) {
      return;
    }

    await shopSystem.populate(`channel`).execPopulate();
    await shopSystem.populate(`channelSet`).execPopulate();

    return shopSystem;
  }

  public async findAllByBusiness(
    business: BusinessModel,
  ): Promise<ShopSystemModel[]> {
    await business.populate(`shopSystems`).execPopulate();
    await business.populate(`shopSystems.channel`).execPopulate();
    await business.populate(`shopSystems.channelSet`).execPopulate();

    return business.shopSystems;
  }

  public async deleteOneById(shopSystemId: string): Promise<void> {
    const shopSystem: ShopSystemModel = await this.shopSystemModel.findOneAndDelete({ _id: shopSystemId });
    const business: BusinessModel = await this.businessModel.findOne(
      {
        shopSystems: {
          $in: [shopSystem],
        },
      })
    ;
    if (!business) {
      return;
    }

    business.shopSystems.pull(shopSystemId);

    await business.save();
  }

  public async removeAllByChannelSet(channelSet: ChannelSetModel): Promise<void> {
    await this.shopSystemModel.deleteMany({ channelSet: channelSet.id }).exec();
  }
}
