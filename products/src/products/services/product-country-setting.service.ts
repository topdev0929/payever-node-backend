import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductCountrySettingModel, ProductModel } from '../models';
import { ProductCountrySettingMapperHelper } from '../helpers';
import { CountrySettingInterface, ProductRecommendationsInterface } from '../interfaces';
import { ChannelSetService } from '../../channel-set/services';
import { ChannelSetModel } from '../../channel-set/models';

@Injectable()
export class ProductCountrySettingService {
  constructor(
    @InjectModel('ProductCountrySetting')
    private readonly productCountrySettingModel: Model<ProductCountrySettingModel>,
    private readonly channelSetService: ChannelSetService,
  ) { }

  public async upsertCountrySetting(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    recommendations: ProductRecommendationsInterface,
  ): Promise<void> {
    const existingProductCountrySetting: ProductCountrySettingModel = await this.productCountrySettingModel.findOne(
      {
        product: product._id,
      },
    );

    const productCountrySetting: any = {
      product: product._id,
    };

    if (existingProductCountrySetting) {
      productCountrySetting.countrySettings = existingProductCountrySetting.countrySettings;
      productCountrySetting.countrySettings[product.country] = ProductCountrySettingMapperHelper.map(
        product,
        recommendations,
      );
    } else {
      productCountrySetting.countrySettings = {
        [product.country] : ProductCountrySettingMapperHelper.map(product, recommendations),
      };
    }

    await this.productCountrySettingModel.findOneAndUpdate(
      {
        product: product._id,
      },
      {
        $set: productCountrySetting,
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async removeCountrySetting(productId: string): Promise<void> {
    await this.productCountrySettingModel.deleteMany(
      {
        product: productId,
      },
    );
  }

  public async getProductCountrySetting(productId: string, country: string): Promise<any> {
    const productCountrySetting: ProductCountrySettingModel = await this.productCountrySettingModel.findOne(
      {
        product: productId,
      },
    );

    if (!productCountrySetting) {
      return ;
    }

    const countrySetting: CountrySettingInterface = productCountrySetting.countrySettings[country];
    if (!countrySetting) {
      return ;
    }

    let channelSets: ChannelSetModel[] = [];

    if (countrySetting?.channelSets?.length > 0) {
      channelSets = await this.channelSetService.findByIds(countrySetting.channelSets);
    }

    return {
      ...countrySetting,
      channelSets,
    };
  }
}
