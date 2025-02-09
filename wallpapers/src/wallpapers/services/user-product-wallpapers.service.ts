import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto, ProductWallpapersDto, SearchProductWallpapersDto } from '../dto';
import { WallpaperInterface } from '../interfaces';
import { UserProductIndustryModel, UserProductModel } from '../models';
import { UserProductIndustrySchemaName, UserProductSchemaName } from '../schemas';
import { ProductWallpaperFilterCollector } from './filters';

@Injectable()
export class UserProductsService {
  constructor(
    @InjectModel(UserProductSchemaName)
    private readonly userProductModel: Model<UserProductModel>,
    private readonly productWallpaperFilterCollector: ProductWallpaperFilterCollector,
    private readonly logger: Logger,
    @InjectModel(UserProductIndustrySchemaName)
    private readonly productIndustryModel: Model<UserProductIndustryModel>,
  ) { }

  public async getAllUserProducts(): Promise<UserProductModel[]> {
    return this.userProductModel.find({ }).populate('industry');
  }

  public async getAllUserProductstree(): Promise<UserProductModel[]> {
    const industries: UserProductIndustryModel[] =
      await this.productIndustryModel.find().sort({ order: 1 }).exec();

    const grouped: any = [];
    for (const industry of industries) {
      let industryProducts: UserProductModel[] = await this.userProductModel.find({ industry }).exec();
      industryProducts = industryProducts.map(
        (userProduct: UserProductModel) => {
          if (userProduct.wallpapers) {
            userProduct.wallpapers = [];
          }

          return userProduct;
        },
      );
      grouped.push(Object.assign({ }, industry.toObject(), { industries: industryProducts }));
    }

    return grouped;
  }

  public async searchAllUserProductWallpapers(
    pagination: PaginationDto,
    searchConditions: SearchProductWallpapersDto,
  ): Promise<ProductWallpapersDto[]> {
    const limit: number = pagination.limit ? pagination.limit : 10;
    const skip: number = pagination.page ? (pagination.page - 1) * limit : 0;

    let grouped: ProductWallpapersDto[] = [];
    if (!!searchConditions.id) {
      grouped = await this.getAllUserProductWallpapersById(pagination, searchConditions.id, true);
    } else {
      grouped = await this.getAllUserProductWallpapers(pagination, true);
    }

    grouped = await this.filterWallpapersBySearchConditions(grouped, searchConditions);

    return grouped.slice(Number(skip), Number(skip) + Number(limit));
  }

  public async getAllUserProductWallpapers(
    pagination: PaginationDto,
    all: boolean = false,
  ): Promise<ProductWallpapersDto[]> {
    const limit: number = pagination.limit ? pagination.limit : 10;
    const skip: number = pagination.page ? (pagination.page - 1) * limit : 0;
    const industries: UserProductIndustryModel[] =
      await this.productIndustryModel.find().sort({ order: 1 }).exec();

    let grouped: ProductWallpapersDto[] = [];
    for (const industry of industries) {
      grouped = [...grouped, ...(await this.getIndustryWallpapersByCondition({ industry }))];
    }

    return all ? grouped : grouped.slice(Number(skip), Number(skip) + Number(limit));
  }

  public async getAllUserProductWallpapersById(
    pagination: PaginationDto,
    id: string,
    all: boolean = false,
  ): Promise<WallpaperInterface[]> {
    const limit: number = pagination.limit ? pagination.limit : 10;
    const skip: number = pagination.page ? (pagination.page - 1) * limit : 0;
    const industries: UserProductIndustryModel[] =
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

  public async updateWallpaperByProductAndIndustry(
    industryCode: string,
    productCode: string,
    wallpapers: WallpaperInterface[],
  ): Promise<UserProductModel> {
    const industry: UserProductIndustryModel
      = await this.productIndustryModel.findOne({ code: industryCode }).exec();

    if (!industry) {
      this.logger.error(`There are no industries found by code "${industryCode}"`);

      return;
    }

    return this.userProductModel.findOneAndUpdate(
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

  public async deleteWallpaper(product_code: string, wallpaper: string): Promise<UserProductModel> {
    const product: UserProductModel = await this.userProductModel.findOne({
      code: product_code,
    }).exec();
    if (!product) {
      throw new NotFoundException(`No user-product with code ${product_code}`);
    }

    if (!product.wallpapers.find((x : WallpaperInterface) => x.wallpaper === wallpaper)) {
      throw new NotFoundException(`No wallpaper ${wallpaper} in product`);
    }

    return this.userProductModel.findOneAndUpdate(
      { code: product_code },
      { $pull: { wallpapers: { wallpaper: wallpaper } } },
      { new: true },
    ).exec();
  }

  private async getIndustryWallpapersByCondition(condition: any): Promise<ProductWallpapersDto[]> {
    let grouped: WallpaperInterface[] = [];
    const industryProducts: UserProductModel[] = await this.userProductModel.find(condition).exec();
    industryProducts.forEach(
      (userProduct: UserProductModel): any => {
        if (!!userProduct.wallpapers) {
          const wallpapers: ProductWallpapersDto[] = userProduct.toObject().wallpapers.map(
            (wallpaperModel: WallpaperInterface) => {
              return {
                ...wallpaperModel,
                industry: userProduct.code,
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
