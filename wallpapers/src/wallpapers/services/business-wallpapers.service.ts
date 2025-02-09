import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { CreateBusinessWallpapersDto, CreateWallpaperDto, AdminBusinessWallpaperListDto } from '../dto';
import { BusinessWallpaperEmitterEvents } from '../enum';
import { BusinessWallpapersModel } from '../models';
import { BusinessWallpapersSchemaName } from '../schemas';
import { WallpaperInterface } from '../interfaces';
import { BusinessWallpaperMessagesProducer } from '../producers';

@Injectable()
export class BusinessWallpapersService {

  constructor(
    @InjectModel(BusinessWallpapersSchemaName)
      private readonly businessWallpapersModel: Model<BusinessWallpapersModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessWallpaperMessageProducer: BusinessWallpaperMessagesProducer,
  ) {
  }

  public async addWallpaper(businessId: string, dto: CreateWallpaperDto): Promise<BusinessWallpapersModel> {
    const originalBusinessWallpapers: BusinessWallpapersModel = await this.findByBusiness(businessId);

    if (!originalBusinessWallpapers) {
      const createWallpapersDto: CreateBusinessWallpapersDto = {
        businessId,
        myWallpapers: [dto],
      };

      const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.create(
        createWallpapersDto,
      );

      await this.eventDispatcher.dispatch(BusinessWallpaperEmitterEvents.BusinessWallpaperCreated, businessWallpapers);

      await this.businessWallpaperMessageProducer.produceBusinessCurrentWallpaperUpdated(
        businessId,
        businessWallpapers.currentWallpaper,
      );

      return businessWallpapers;

    } else {

      const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.findOneAndUpdate(
        { businessId },
        { $push: { myWallpapers: dto } },
        { new: true },
      ).exec();

      await this.eventDispatcher.dispatch(
        BusinessWallpaperEmitterEvents.BusinessWallpaperUpdated,
        originalBusinessWallpapers,
        businessWallpapers,
      );

      await this.businessWallpaperMessageProducer.produceBusinessCurrentWallpaperUpdated(
        businessId,
        businessWallpapers.currentWallpaper,
      );

      return businessWallpapers;
    }
  }

  public async setCurrent(businessId: string, dto: CreateWallpaperDto): Promise<BusinessWallpapersModel> {

    const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.findOneAndUpdate(
      { businessId },
      { $set: { currentWallpaper: dto, type: 'custom' } },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );

    await this.businessWallpaperMessageProducer.produceBusinessCurrentWallpaperUpdated(
      businessId,
      businessWallpapers.currentWallpaper,
    );

    return businessWallpapers;
  }

  public async setCurrentByRandom(
    businessId: string,
    wallpaper: WallpaperInterface,
    product: string,
    industry: string,
  ): Promise<BusinessWallpapersModel> {
    const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.findOneAndUpdate(
      { businessId },
      { $set: { currentWallpaper: wallpaper, type: 'random', product: product, industry: industry } },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );

    await this.businessWallpaperMessageProducer.produceRpcBusinessCurrentWallpaperUpdated(
      businessId,
      businessWallpapers.currentWallpaper,
    );

    return businessWallpapers;
  }

  public async resetCurrent(businessId: string): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersModel.findOneAndUpdate(
      { businessId },
      { $unset: { currentWallpaper: '' } },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async setWallpapers(businessId: string, wallpapers: WallpaperInterface[]): Promise<BusinessWallpapersModel> {

    const originalBusinessWallpapers: BusinessWallpapersModel = await this.findByBusiness(businessId);

    if (!originalBusinessWallpapers) {
      const createWallpapersDto: CreateBusinessWallpapersDto = {
        businessId,
        myWallpapers: wallpapers,
      };

      const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.create(
        createWallpapersDto,
      );

      await this.eventDispatcher.dispatch(BusinessWallpaperEmitterEvents.BusinessWallpaperCreated, businessWallpapers);

      return businessWallpapers;

    } else {
      const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.findOneAndUpdate(
        { businessId },
        {
          $set: { myWallpapers: wallpapers },
        },
        { new: true },
      ).exec();

      await this.eventDispatcher.dispatch(
        BusinessWallpaperEmitterEvents.BusinessWallpaperUpdated,
        originalBusinessWallpapers,
        businessWallpapers,
      );

      return businessWallpapers;
    }
  }

  public async deleteWallpaper(businessId: string, wallpaper: string): Promise<BusinessWallpapersModel> {
    const businessWallpaper: BusinessWallpapersModel = await this.businessWallpapersModel.findOne({
      businessId,
    }).exec();
    if (!businessWallpaper) {
      throw new NotFoundException(`No business with id ${businessId}`);
    }

    if (!businessWallpaper.myWallpapers.find((x : WallpaperInterface) => x.wallpaper === wallpaper)) {
      throw new NotFoundException(`No wallpaper ${wallpaper} in business`);
    }

    const updatedBusinessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.findOneAndUpdate(
      { businessId },
      { $pull: { myWallpapers: { wallpaper: wallpaper } } },
      { new: true },
    ).exec();

    await this.eventDispatcher.dispatch(
      BusinessWallpaperEmitterEvents.BusinessWallpaperUpdated,
      businessWallpaper,
      updatedBusinessWallpapers,
    );

    return updatedBusinessWallpapers;
  }

  public async deleteBusiness(businessId: string): Promise<void> {
    const businessWallpapers: BusinessWallpapersModel = await this.businessWallpapersModel.findOneAndDelete({
      businessId,
    }).exec();
    if (businessWallpapers) {
      await this.eventDispatcher.dispatch(BusinessWallpaperEmitterEvents.BusinessWallpaperRemoved, businessWallpapers);
    }
  }

  public async findByBusiness(businessId: string): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersModel.findOne({ businessId });
  }

  public async getList(query: any, limit: number, skip: number): Promise<BusinessWallpapersModel[]> {
    return this.businessWallpapersModel.find(query).limit(limit).skip(skip);
  }

  public async retrieveListForAdmin(query: AdminBusinessWallpaperListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const wallpapers: BusinessWallpapersModel[] = await this.businessWallpapersModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.businessWallpapersModel.count();

    return {
      page,
      total,
      wallpapers,
    };
  }
}
