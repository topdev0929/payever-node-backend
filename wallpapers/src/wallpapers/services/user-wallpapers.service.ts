import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { FolderDocument, FolderModelService, ScopeEnum } from '@pe/folders-plugin';
import { AdminUserWallpapersListDto, CreateUserWallpapersDto, CreateWallpaperDto } from '../dto';
import { UserWallpapersEmitterEventsEnum } from '../enum';
import { UserWallpapersModel } from '../models';
import { UserWallpapersSchemaName } from '../schemas';
import { WallpaperInterface } from '../interfaces';
import { folders } from '../../../fixtures/folders.fixture';
@Injectable()
export class UserWallpapersService {

  constructor(
    @InjectModel(UserWallpapersSchemaName) private readonly userWallpapersModel: Model<UserWallpapersModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly folderService: FolderModelService,
  ) {
  }

  public async addWallpaper(userId: string, dto: CreateWallpaperDto)
    : Promise<UserWallpapersModel> {
    const originalUserWallpapers: UserWallpapersModel = await this.findByUser(userId);
    if (!originalUserWallpapers) {
      const createWallpapersDto: CreateUserWallpapersDto = {
        myWallpapers: [dto],
        user: userId,
      };

      const userWallpapers: UserWallpapersModel = await this.userWallpapersModel.create(createWallpapersDto);
      await this.eventDispatcher.dispatch(UserWallpapersEmitterEventsEnum.UserWallpapersCreated, userWallpapers);

      return userWallpapers;
    } else {

      const userWallpapers: UserWallpapersModel = await this.userWallpapersModel.findOneAndUpdate(
        { user: userId },
        { $push: { myWallpapers: dto } },
        { new: true },
      ).exec();

      await this.eventDispatcher.dispatch(
        UserWallpapersEmitterEventsEnum.UserWallpapersUpdated,
        originalUserWallpapers,
        userWallpapers,
      );

      return userWallpapers;
    }
  }

  public async setCurrent(userId: string, dto: CreateWallpaperDto): Promise<UserWallpapersModel> {

    return this.userWallpapersModel.findOneAndUpdate(
      { user: userId },
      { $set: { currentWallpaper: dto } },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async resetCurrent(userId: string): Promise<UserWallpapersModel> {
    return this.userWallpapersModel.findOneAndUpdate(
      { user: userId },
      { $unset: { currentWallpaper: '' } },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async setWallpapers(userId: string, dto: CreateWallpaperDto[]): Promise<UserWallpapersModel> {
    const originalUserWallpapers: UserWallpapersModel = await this.findByUser(userId);
    if (!originalUserWallpapers) {
      const createWallpapersDto: CreateUserWallpapersDto = {
        myWallpapers: dto,
        user: userId,
      };

      const userWallpapers: UserWallpapersModel = await this.userWallpapersModel.create(createWallpapersDto);
      await this.eventDispatcher.dispatch(UserWallpapersEmitterEventsEnum.UserWallpapersCreated, userWallpapers);

      return userWallpapers;
    } else {
      const userWallpapers: UserWallpapersModel = await this.userWallpapersModel.findOneAndUpdate(
        { user: userId },
        {
          $set: { myWallpapers: dto },
        },
        { new: true },
      ).exec();

      await this.eventDispatcher.dispatch(
        UserWallpapersEmitterEventsEnum.UserWallpapersUpdated,
        originalUserWallpapers,
        userWallpapers,
      );

      return userWallpapers;
    }
  }

  public async setupDefaultFolders(): Promise<void> {
    for (const folder of folders) {
      const foundFolder: FolderDocument = await this.folderService.getFolder(folder._id);
      if (folder.parentFolderId === null)  {
        delete folder.parentFolderId;
      }

      if (!foundFolder) {
        await this.folderService.create({
          ...folder,
          scope: ScopeEnum.Default,
        });
      } else {
        await this.folderService.updateOne(
          foundFolder,
          {
            ...folder,
          },
        );
      }
    }
  }

  public async deleteWallpaper(userId: string, wallpaper: string): Promise<UserWallpapersModel> {
    const originalUserWallpaper: UserWallpapersModel = await this.userWallpapersModel.findOne({ user: userId }).exec();
    if (!originalUserWallpaper) {
      throw new NotFoundException(`No user with id ${userId}`);
    }

    if (!originalUserWallpaper.myWallpapers.find((x : WallpaperInterface) => x.wallpaper === wallpaper)) {
      throw new NotFoundException(`No wallpaper ${wallpaper} in user`);
    }

    const updatedWallpaper: UserWallpapersModel = await this.userWallpapersModel.findOneAndUpdate(
      { user: userId },
      { $pull: { myWallpapers: { wallpaper: wallpaper } } },
      { new: true },
    ).exec();

    await this.eventDispatcher.dispatch(
      UserWallpapersEmitterEventsEnum.UserWallpapersUpdated,
      originalUserWallpaper,
      updatedWallpaper,
    );

    return updatedWallpaper;
  }

  public async deleteUser(userId: string): Promise<void> {
    const userWallpaper: UserWallpapersModel = await this.userWallpapersModel.findOneAndDelete({ user: userId }).exec();

    await this.eventDispatcher.dispatch(
      UserWallpapersEmitterEventsEnum.UserWallpapersRemoved,
      userWallpaper,
    );
  }

  public async findByUser(userId: string): Promise<UserWallpapersModel> {
    return this.userWallpapersModel.findOne({ user: userId });
  }

  public async getList(query: any, limit: number, skip: number): Promise<UserWallpapersModel[]> {
    return this.userWallpapersModel.find(query).limit(limit).skip(skip);
  }

  public async retrieveListForAdmin(query: AdminUserWallpapersListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.userIds) {
      conditions.user = { $in: query.userIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const wallpapers: UserWallpapersModel[] = await this.userWallpapersModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.userWallpapersModel.count();

    return {
      page,
      total,
      wallpapers,
    };
  }

}
