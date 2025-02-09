import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MediaContainersEnum, MediaRelatedEntityDto } from '@pe/media-sdk';
import { Model } from 'mongoose';
import { StorageContainerEnum } from '../enum';
import { MediaItemModel } from '../models';
import { MediaItemRelationModel } from '../models/media-item-relation.model';
import { BlobStorageService } from '../../storage';
import { RestrictedMediaResolver } from './restricted-media-resolver';
import * as randomstring from 'randomstring';
import { FileQueryDto } from '../dto';
import { EntityTypeEnum } from '../enums/entity-type.enum';

@Injectable()
export class MediaItemService {
  private removableContainers: MediaContainersEnum[] = [
    MediaContainersEnum.Products,
  ];

  constructor(
    @InjectModel('MediaItem') private readonly mediaItemModel: Model<MediaItemModel>,
    @InjectModel('MediaItemRelation') private readonly mediaItemRelationModel: Model<MediaItemRelationModel>,
    private readonly storageService: BlobStorageService,
    private readonly restrictedMediaResolver: RestrictedMediaResolver,
    private readonly logger: Logger,
  ) { }

  public async getForAdmin(query: FileQueryDto)
    : Promise<{ documents: MediaItemModel[]; page: number; total: number }> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };


    if (query.applicationIds) {
      conditions.applicationId
        = { $in: Array.isArray(query.applicationIds) ? query.applicationIds : [query.applicationIds] };
    }

    if (query.container) {
      conditions.container = query.container;
    }

    if (query.nameRegex) {
      conditions.name = { $regex: query.nameRegex };
    }

    if (query.name) { // exact name
      conditions.name = query.name;
    }

    if (query.createdAtLte) {
      conditions.createdAt = { ...conditions.createdAt, $lte: new Date(query.createdAtLte).toISOString() };
    }

    if (query.createdAtGte) {
      conditions.createdAt = { ...conditions.createdAt, $gte: new Date(query.createdAtGte).toISOString() };
    }

    if (query.updatedAtLte) {
      conditions.updatedAt = { ...conditions.updatedAt, $lte: new Date(query.updatedAtLte).toISOString() };
    }

    if (query.updatedAtGte) {
      conditions.updatedAt = { ...conditions.updatedAt, $gte: new Date(query.updatedAtGte).toISOString() };
    }


    const documents: MediaItemModel[] = await this.mediaItemModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.mediaItemModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async create(name: string, container: StorageContainerEnum, applicationId?: string): Promise<MediaItemModel> {
    let mediaItemModel: MediaItemModel;
    try {
      mediaItemModel = await this.mediaItemModel.create({ name, container, applicationId } as MediaItemModel);
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        name = `${name}-${randomstring.generate(7)}`;
        mediaItemModel = await this.mediaItemModel.create({ name, container, applicationId } as MediaItemModel);
      }
    }

    return mediaItemModel;
  }

  public async associateToBusiness(
    name: string,
    container: string,
    businessId: string,
  ): Promise<void> {
    await this.associate(name, container, { id: businessId, type: EntityTypeEnum.business });
  }

  public async disassociateFromBusiness(
    name: string,
    container: string,
    businessId: string,
  ): Promise<void> {
    await this.disassociate(name, container, { id: businessId, type: EntityTypeEnum.business });
  }

  public async associateToUser(
    name: string,
    container: string,
    userId: string,
  ): Promise<void> {
    await this.associate(name, container, { id: userId, type: EntityTypeEnum.user });
  }

  public async disassociateFromUser(
    name: string,
    container: string,
    userId: string,
  ): Promise<void> {
    await this.disassociate(name, container, { id: userId, type: EntityTypeEnum.business });
  }

  public async findOneForBusiness(
    name: string,
    container: string,
    businessId: string,
  ): Promise<MediaItemModel> {
    return this.findOneForEntity(name, container, businessId, EntityTypeEnum.business);
  }

  public async findOneForUser(
    name: string,
    container: string,
    userId: string,
  ): Promise<MediaItemModel> {
    return this.findOneForEntity(name, container, userId, EntityTypeEnum.user);
  }

  public async findOneForEntity(
    name: string,
    container: string,
    entityId: string,
    entityType: string,
  ): Promise<MediaItemModel> {
    const mediaItems: MediaItemModel[] = await this.mediaItemModel.find({
      container,
      name,
    }).lean();

    if (!mediaItems?.length) {
      return null;
    }

    const mediaItemIds: string[] = mediaItems.map((item: any) => item._id);
    const relation: MediaItemRelationModel = await this.mediaItemRelationModel.findOne({
      entityId,
      entityType,
      mediaItem: { '$in': mediaItemIds } as any,
    }).lean();

    if (!relation) {
      return null;
    }

    return mediaItems.find((item: any) => item._id === relation.mediaItem);
  }


  public async associate(
    name: string,
    container: string,
    relatedEntity: MediaRelatedEntityDto,
  ): Promise<void> {
    const mediaItem: MediaItemModel = await this.touch(name, container);

    await this.mediaItemRelationModel.updateOne(
      {
        entityId: relatedEntity.id,
        entityType: relatedEntity.type,
        mediaItem: mediaItem.id,
      },
      {
        entityId: relatedEntity.id,
        entityType: relatedEntity.type,
        mediaItem: mediaItem.id,
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  public async getByNameAndContainer(name: string, container: StorageContainerEnum): Promise<MediaItemModel> {
    return this.mediaItemModel.findOne({ name, container });
  }

  public async getByApplicationIdAndContainer(applicationId: string, container: StorageContainerEnum)
    : Promise<MediaItemModel[]> {
    return this.mediaItemModel.find({ applicationId, container });
  }

  public async disassociate(name: string, container: string, relatedEntity: MediaRelatedEntityDto): Promise<void> {
    const mediaItem: MediaItemModel = await this.mediaItemModel.findOne({
      container,
      name,
    }).exec();

    if (mediaItem) {
      await this.touch(name, container);
      await this.mediaItemRelationModel.deleteOne(
        {
          entityId: relatedEntity.id,
          entityType: relatedEntity.type,
          mediaItem: mediaItem.id,
        },
      );
    }
  }

  public async removeUnassignedOlderThan(tillDate: Date): Promise<void> {
    const unusedMediaItems: MediaItemModel[] = await this.mediaItemModel.aggregate([
      {
        $match: {
          $and: [
            { updatedAt: { $lte: tillDate } },
            { container: { $in: this.removableContainers } },
          ],
        },
      },
      {
        $lookup: {
          as: 'relations',
          foreignField: 'mediaItem',
          from: 'mediaitemrelations',
          localField: '_id',
        },
      },
      {
        $match: {
          $and: [
            { relations: [] },
          ],
        },
      },
    ]).exec();

    const removeIds: any = [];
    for (const mediaItem of unusedMediaItems) {
      if (this.restrictedMediaResolver.isRestricted(mediaItem.name, mediaItem.container)) {
        this.logger.warn(
          `Media "${mediaItem.name}" from container "${mediaItem.container}" is restricted for deletion`,
        );
        continue;
      }

      removeIds.push(mediaItem._id);
      try {
        await this.storageService.deleteBlob(mediaItem.container, mediaItem.name);
      } catch (e) {
        this.logger.warn(e.message);
      }
    }

    if (removeIds.length > 0) {
      await this.mediaItemModel.deleteMany({ _id: { $in: removeIds } });
    }
  }

  public async remove(name: string, container: string): Promise<void> {
    if (this.restrictedMediaResolver.isRestricted(name, container)) {
      this.logger.warn(`Media "${name}" from container "${container}" is restricted for deletion`);

      return;
    }

    const mediaItem: MediaItemModel = await this.mediaItemModel.findOneAndDelete({ name, container }).exec();
    if (mediaItem) {
      await this.mediaItemRelationModel.deleteMany({ mediaItem: mediaItem }).exec();
    }
  }

  private async touch(name: string, container: string): Promise<MediaItemModel> {
    try {
      return await this.mediaItemModel.findOneAndUpdate(
        { name, container },
        { name, container },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return this.touch(name, container);
      } else {
        throw err;
      }
    }
  }
}
