import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto, ProductWallpapersDto, SearchProductWallpapersDto } from '../dto';
import { ProductInterface, WallpaperInterface } from '../interfaces';
import { BusinessProductIndustryModel, BusinessProductModel } from '../models';
import { BusinessProductIndustrySchemaName, BusinessProductSchemaName } from '../schemas';
import { ProductWallpaperFilterCollector } from './filters';

@Injectable()
export class BusinessProductsService {
  constructor(
    @InjectModel(BusinessProductSchemaName)
    private readonly businessProductModel: Model<BusinessProductModel>,
    private readonly productWallpaperFilterCollector: ProductWallpaperFilterCollector,
    private readonly logger: Logger,
    @InjectModel(BusinessProductIndustrySchemaName)
    private readonly productIndustryModel: Model<BusinessProductIndustryModel>,
  ) { }

  public async getAllBusinessProducts(): Promise<BusinessProductModel[]> {
    return this.businessProductModel.find({ }).populate('industry');
  }

  public async getAllBusinessProductstree(): Promise<BusinessProductModel[]> {
    const industries: BusinessProductIndustryModel[] =
      await this.productIndustryModel.find().sort({ order: 1 }).exec();

    const grouped: any = [];
    for (const industry of industries) {
      let industryProducts: BusinessProductModel[] = await this.businessProductModel.find({ industry }).exec();
      industryProducts = industryProducts.map(
        (businessProduct: BusinessProductModel) => {
          if (businessProduct.wallpapers) {
            businessProduct.wallpapers = [];
          }

          return businessProduct;
        },
      );
      grouped.push(Object.assign({ }, industry.toObject(), { industries: industryProducts }));
    }

    return grouped;
  }

  public async searchAllBusinessProductWallpapers(
    pagination: PaginationDto,
    searchConditions: SearchProductWallpapersDto,
  ): Promise<ProductWallpapersDto[]> {
    const limit: number = pagination.limit ? pagination.limit : 10;
    const skip: number = pagination.page ? (pagination.page - 1) * limit : 0;

    let grouped: ProductWallpapersDto[] = [];
    if (!!searchConditions.id) {
      grouped = await this.getAllBusinessProductWallpapersById(pagination, searchConditions.id, true);
    } else {
      grouped = await this.getAllBusinessProductWallpapers(pagination, true);
    }

    grouped = await this.filterWallpapersBySearchConditions(grouped, searchConditions);

    return grouped.slice(Number(skip), Number(skip) + Number(limit));
  }

  public async getAllBusinessProductWallpapers(
    pagination: PaginationDto,
    all: boolean = false,
  ): Promise<ProductWallpapersDto[]> {
    const limit: number = pagination.limit ? pagination.limit : 10;
    const skip: number = pagination.page ? (pagination.page - 1) * limit : 0;
    const industries: BusinessProductIndustryModel[] =
      await this.productIndustryModel.find().sort({ order: 1 }).exec();

    let grouped: ProductWallpapersDto[] = [];
    for (const industry of industries) {
      grouped = [...grouped, ...(await this.getIndustryWallpapersByCondition({ industry }))];
    }

    return all ? grouped : grouped.slice(Number(skip), Number(skip) + Number(limit));
  }

  public async getAllBusinessProductWallpapersById(
    pagination: PaginationDto,
    id: string,
    all: boolean = false,
  ): Promise<WallpaperInterface[]> {
    const limit: number = pagination.limit ? pagination.limit : 10;
    const skip: number = pagination.page ? (pagination.page - 1) * limit : 0;
    const industries: BusinessProductIndustryModel[] =
      await this.productIndustryModel.find({ _id: id });

    let grouped: WallpaperInterface[] = [];
    if (industries.length !== 0) {
      for (const industry of industries) {
        grouped = [...grouped, ...(await this.getIndustryWallpapersByCondition({ industry }))];
      }
    } else {
      grouped = [...grouped, ...(await this.getIndustryWallpapersByCondition({ _id: id }))];
    }

    return all ? grouped : grouped.slice(Number(skip), Number(skip) + Number(limit));
  }

  /**
   * @deprecated left for BC, because businessProducts and industries were switched up
   * @returns {Promise<any[]>}
   */
  public async getAllBusinessProductGroupedByIndustry(): Promise<any[]> {
    const industries: BusinessProductIndustryModel[] =
      await this.productIndustryModel.find().sort({ order: 1 }).exec();

    const grouped: any = [];
    for (const industry of industries) {
      const industryProducts: BusinessProductModel[] = await this.businessProductModel.find({ industry }).exec();

      grouped.push(Object.assign({ }, industry.toObject(), { industries: industryProducts }));
    }

    return grouped;
  }

  /**
   * @deprecated left for BC, because businessProducts and industries were switched up
   * @param {string} industryCode
   * @returns {Promise<any>}
   */
  public async getByIndustryCode(
    industryCode: string,
  ): Promise<any> {
    const industry: BusinessProductIndustryModel
      = await this.productIndustryModel.findOne({ code: industryCode }).exec();

    if (!industry) {
      this.logger.error(`There are no industries found by code "${industryCode}".`);
    }

    const products: BusinessProductModel[] = await this.businessProductModel.find({ industry }).exec();

    return {
      ...industry,
      industries: products,
    };
  }

  public async getWallpaperByProductAndIndustry(
    industryCode: string,
    productCode: string,
  ): Promise<WallpaperInterface[]> {
    const productIndustry: any = await this.getByIndustryCode(industryCode);
    const businessProduct: ProductInterface = productIndustry.industries.find(
      (x: ProductInterface) => x.code === industryCode,
    );

    if (!businessProduct) {
      this.logger.error(`There are no products found by code "${industryCode}" and industry "${productCode}".`);

      return;
    }
    if (!businessProduct.wallpapers || !businessProduct.wallpapers.length) {
      this.logger.error(`There are no wallpapers for industry "${industryCode}" and industry "${productCode}".`);

      return;
    }

    return businessProduct.wallpapers;
  }

  public async updateWallpaperByProductAndIndustry(
    industryCode: string,
    productCode: string,
    wallpapers: WallpaperInterface[],
  ): Promise<BusinessProductModel> {
    const industry: BusinessProductIndustryModel
      = await this.productIndustryModel.findOne({ code: industryCode }).exec();

    if (!industry) {
      this.logger.error(`There are no industries found by code "${industryCode}"`);

      return;
    }

    return this.businessProductModel.findOneAndUpdate(
      {
        code: productCode,
        industry: industry,
      },
      {
        $set: { wallpapers },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async deleteWallpaper(product_code: string, wallpaper: string): Promise<BusinessProductModel> {
    const product: BusinessProductModel = await this.businessProductModel.findOne({
      code: product_code,
    }).exec();
    if (!product) {
      throw new NotFoundException(`No business-product with code ${product_code}`);
    }

    if (!product.wallpapers.find((x : WallpaperInterface) => x.wallpaper === wallpaper)) {
      throw new NotFoundException(`No wallpaper ${wallpaper} in product`);
    }

    return this.businessProductModel.findOneAndUpdate(
      { code: product_code },
      { $pull: { wallpapers: { wallpaper: wallpaper } } },
      { new: true },
    ).exec();
  }

  private async getIndustryWallpapersByCondition(condition: any): Promise<ProductWallpapersDto[]> {
    let grouped: WallpaperInterface[] = [];
    const industryProducts: BusinessProductModel[] = await this.businessProductModel.find(condition).exec();
    industryProducts.forEach(
      (businessProduct: BusinessProductModel): any => {
        if (!!businessProduct.wallpapers) {
          const wallpapers: ProductWallpapersDto[] = businessProduct.toObject().wallpapers.map(
            (wallpaperModel: WallpaperInterface) => {
              return {
                ...wallpaperModel,
                industry: businessProduct.code,
              };
            },
          );
          grouped = [...grouped, ...wallpapers];
        }
      },
    );

    return grouped;
  }

  private async filterWallpapersBySearchConditions(
    wallpapers: ProductWallpapersDto[],
    searchConditions: SearchProductWallpapersDto,
  ): Promise<ProductWallpapersDto[]> {
    const filterredWallpapers: ProductWallpapersDto[] = [];
    for (const wallpaper of wallpapers) {
      let result: boolean = true;
      for (const condition of searchConditions.conditions) {
        result = result && (await this.productWallpaperFilterCollector.filterByAll(wallpaper, condition));
      }

      if (result) {
        filterredWallpapers.push(wallpaper);
      }
    }

    return filterredWallpapers;
  }

}
