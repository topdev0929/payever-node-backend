import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessProductIndustrySchemaName, BusinessProductSchemaName } from '../schemas';
import {
  BusinessProductIndustryInterfac,
  BusinessProductIndustryModel,
  BusinessProductModel,
} from '../interfaces/entities';

@Injectable()
export class BusinessProductsService {
  constructor(
    @InjectModel(BusinessProductSchemaName) private readonly productModel: Model<BusinessProductModel>,
    @InjectModel(BusinessProductIndustrySchemaName)
      private readonly productIndustryModel: Model<BusinessProductIndustryModel>,
  ) { }

  public async getAllProducts(): Promise<BusinessProductModel[]> {
    return this.productModel.find();
  }

  /**
   * @deprecated Method is used for BC, when businessProducts and industries were switched up
   * @returns {Promise<BusinessProductIndustryInterfac[]>}
   */
  public async getAllProductsGroupedByIndustry(): Promise<any[]> {
    const industries: BusinessProductIndustryModel[] = await this.productIndustryModel.find().sort({ order: 1 });

    const groupped: any = [];
    for (const industry of industries) {
      const industryProducts: BusinessProductModel[] = await this.getProductsByIndustry(industry);

      groupped.push(Object.assign({ }, industry.toObject(), { industries: industryProducts }));
    }

    return groupped;
  }

  public async getByCode(code: string): Promise<BusinessProductIndustryInterfac> {
    return this.productModel.findOne({ code });
  }

  /**
   * @deprecated Method is used for BC, when businessProducts and industries were switched up
   * @param {string} code
   * @returns {Promise<BusinessProductIndustryInterfac>}
   */
  public async getIndustryByCode(code: string): Promise<BusinessProductIndustryModel> {
    return this.productIndustryModel.findOne({ code });
  }

  public async getProductsByIndustry(industry: BusinessProductIndustryModel): Promise<BusinessProductModel[]> {
    return this.productModel.find({ industry });
  }

  public async getIndustryWallpaperBySlug(slug: string): Promise<string> {
    const product: BusinessProductModel = await this.productModel.findOne({ slug });

    return product ? product.wallpaper : null;
  }
}
