import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher, UserRoleInterface } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import {
  AttributeFilterDto,
  BuilderUserMediasDto,
  DuplicateMediaDto,
  IdsDto,
  MoveMediaDto,
  PaginationDto,
  SearchMediaDto,
  UserMediaDto,
} from '../dto';
import { MediaOwnerTypeEnum, MediaTypeEnum, UserMediaEventsEnum } from '../enums';
import { AttributeHelper, MediaTypeHelper, PaginationHelper, UserRoleHelper } from '../helpers';
import {
  MediaInfoInterface,
  PaginationInterface,
  UserMediaAttributeInterface,
  UserMediaInterface,
  UserMediaUploadedInterface,
} from '../interfaces';
import { UserAlbumModel, UserAttributeModel, UserMediaModel } from '../models';
import { UserMediaSchemaName } from '../schemas';
import { BusinessService } from '../../business/services';
import { MediaInfoTaskService } from './media-info-task.service';
import { BusinessMediaMessagesProducer } from '../producers';
import { UserAttributeService } from './user-attribute.service';
import { BlobInterface } from '../interfaces/blob.interface';
import { MediaUploadService } from './media-upload.service';
import { CounterService } from './counter.service';
import { QueryBuilderService } from './query-builder.service';
import { AdminUserMediaQueryDto } from '../dto/admin-user-media-query.dto';

const attributeRefference: string = 'attributes.attribute';
const userAttributeRefference: string = 'userAttributes.attribute';
const selectFields: string = 'icon name type';

@Injectable()
export class UserMediaService {

  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessService: BusinessService,
    private readonly mediaInfoTaskService: MediaInfoTaskService,
    private readonly businessMediaMessagesProducer: BusinessMediaMessagesProducer,
    private readonly userAttributeService: UserAttributeService,
    private readonly mediaUploadService: MediaUploadService,
    private readonly counterService: CounterService,
    private readonly queryBuilderService: QueryBuilderService,
  ) { }

  public async getForAdmin(query: AdminUserMediaQueryDto)
    : Promise<{ documents: UserMediaModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { };
    const skip: number = (page - 1) * limit;    

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    if (query.albumIds) {
      conditions.album = { $in: Array.isArray(query.albumIds) ? query.albumIds : [query.albumIds] };
    }

    if (query.name !== undefined) {
      conditions.name = { $regex: query.name, $options: 'i' };
    }

    if (query.noalbum === 'true') {
      conditions.album = { $exists: false };
    }

    if (query.userAttributeId !== undefined) {
      conditions['userAttributes.attribute'] = query.userAttributeId;
    }

    if (query.userAttributeValue !== undefined) {
      conditions['userAttributes.value'] = query.userAttributeValue;      
    }


    const documents: UserMediaModel[] = await this.userMediaModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        match: {
          showOn: { $in: ['all', 'media'] },
        },
        path: userAttributeRefference,
        select: selectFields,
      }).populate({
        path: attributeRefference,
        select: selectFields,
      })
      .exec();

    const total: number = await this.userMediaModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async create(
    businessId: string,
    dto: UserMediaDto,
    role: UserRoleInterface[],
  ): Promise<UserMediaModel> {
    if (!dto.name) {
      dto.name = await this.generateDefaultName(businessId);
    }

    if (dto.userAttributes && !UserRoleHelper.isAdmin(role)) {
      dto.userAttributes
        = await this.userAttributeService.filterAttributeByNonOnlyAdmin(businessId, dto.userAttributes);
    }

    const set: UserMediaInterface = {
      album: dto.albumId,
      businessId: businessId,
      ...dto,
    };

    if (dto.userAttributeGroups && dto.userAttributeGroups.length > 0) {
      let userAttributes: UserMediaAttributeInterface[]
        = await this.userAttributeService.generateUserAttributeByGroup(businessId, dto.userAttributeGroups);

      userAttributes = AttributeHelper.mergeUserAttributes(userAttributes, set.userAttributes);

      set.userAttributes = userAttributes;
    }

    const created: UserMediaModel = await this.userMediaModel.create(set);
    await this.eventDispatcher.dispatch(UserMediaEventsEnum.UserMediaCreated, created);

    if (created.mediaType === MediaTypeEnum.IMAGE && dto.url) {
      // todo: wait image assessment nima wrapper to other pod
      // const imageAssessmentTask: ImageAssessmentTaskInterface = {
      //   mediaId: created.id,
      //   status: TaskStatusEnum.waiting,
      //   tries: 0,
      //   type: MediaOwnerTypeEnum.USER,
      //   url: created.url,
      // };
      //
      // await this.imageAssessmentTaskService.create(imageAssessmentTask);
    }

    await this.mediaInfoTaskService.create(created.id, created.url, MediaOwnerTypeEnum.USER, created.mediaType);

    return created.populate(
      {
        path: userAttributeRefference,
        select: selectFields,
      },
    ).populate(
      {
        path: attributeRefference,
        select: selectFields,
      },
    ).execPopulate();
  }

  public async update(
    businessId: string,
    userMediaModel: UserMediaModel,
    dto: UserMediaDto,
    role: UserRoleInterface[],
  ): Promise<UserMediaModel> {
    if (dto.userAttributes && !UserRoleHelper.isAdmin(role)) {
      dto.userAttributes
        = await this.userAttributeService.filterAttributeByNonOnlyAdmin(businessId, dto.userAttributes);
    }

    const set: UserMediaInterface = {
      album: dto.albumId,
      businessId: businessId,
      ...dto,
    };

    if (dto.userAttributeGroups && dto.userAttributeGroups.length > 0) {
      let userAttributes: UserMediaAttributeInterface[]
        = await this.userAttributeService.generateUserAttributeByGroup(businessId, dto.userAttributeGroups);

      if (userMediaModel) {
        userAttributes
          = AttributeHelper.mergeUserAttributes(userAttributes, userMediaModel.userAttributes);
      }

      userAttributes = AttributeHelper.mergeUserAttributes(userAttributes, set.userAttributes);

      set.userAttributes = userAttributes;
    }


    const updated: UserMediaModel = await this.userMediaModel.findOneAndUpdate(
      { _id: userMediaModel.id },
      { $set: set },
      { new: true },
    ).exec();

    await this.eventDispatcher.dispatch(UserMediaEventsEnum.UserMediaUpdated, updated);

    return updated.populate(
      {
        path: userAttributeRefference,
        select: selectFields,
      },
    ).populate(
      {
        path: attributeRefference,
        select: selectFields,
      },
    ).execPopulate();
  }


  public async updateMediaInfoById(id: string, mediaInfo: MediaInfoInterface): Promise<UserMediaModel> {
    return this.userMediaModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { mediaInfo: mediaInfo },
      },
      {
        new: true,
        upsert: false,
      },
    );
  }

  public async findById(
    mediaId: string,
  ): Promise<UserMediaModel> {
    const data: UserMediaModel = await  this.userMediaModel.findOne({
      _id: mediaId,
    }).populate({
      match: {
        showOn: { $in: ['all', 'media'] },
      },
      path: userAttributeRefference,
      select: selectFields,
    }).populate({
      path: attributeRefference,
      select: selectFields,
    }).exec();

    return AttributeHelper.filterNotNullUserAttributes(data);
  }

  public async findByIds(
    dto: IdsDto,
  ): Promise<UserMediaModel[]> {

    return this.userMediaModel.find({
      _id: { $in : dto.ids },
    });
  }

  public async getByAlbum(
    albumId: string,
  ): Promise<UserMediaModel[]> {

    return this.userMediaModel.find({
      album: albumId,
    });
  }

  public async remove(
    userMediaModel: UserMediaModel,
  ): Promise<void> {
    await this.eventDispatcher.dispatch(UserMediaEventsEnum.UserMediaDeleted, userMediaModel);
    await this.userMediaModel.deleteOne({ _id: userMediaModel._id }).exec();
  }

  public async removeAllByBusinessId(
    businessId: string,
  ): Promise<void> {
    await this.userMediaModel.deleteMany({
      businessId: businessId,
    }).exec();
  }

  public async removeAllSampleByBusinessId(
    businessId: string,
  ): Promise<void> {
    await this.userMediaModel.deleteMany({
      businessId: businessId,
      example: true,
    }).exec();
  }

  public async findBuilderUserMedia(
    businessId: string,
    filter: any,
    order: any,
    offset: number,
    limit: number,
  ): Promise<BuilderUserMediasDto> {
    offset = offset ? offset : 0;
    limit = limit ? limit : 10;

    const builderFilter: any = filter ? filter : [];
    const orderJson: any[] = order ? order : [];
    const sorts: any = { };
    for (const sub of orderJson) {
      sorts[sub.field] = sub.direction === 'asc' ? 1 : -1;
    }

    const query: any = {
      businessId: businessId,
      ...await this.queryBuilderService.buildQuery(builderFilter, businessId),
    };

    const medias: UserMediaModel[] = await this.userMediaModel.find(query)
      .populate(attributeRefference)
      .populate(userAttributeRefference)
      .sort(sorts).skip(offset).limit(limit).exec();

    const result: any = medias.map((media: UserMediaModel) => {
      const userAttributes: { name: string; value: any } = media.userAttributes.map(this.attributeGqlMap) as any;
      const attributes: { name: string; value: any } = media.attributes.map(this.attributeGqlMap) as any;

      return {
        ...media.toObject(),
        attributes,
        id: media.id,
        userAttributes,
      };
    });

    return {
      result: result,
      totalCount: await this.userMediaModel.count(query).exec(),
    };
  }

  public async findByBusinessId(
    pagination: PaginationDto,
    business: BusinessModel,
  ): Promise<UserMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const data: UserMediaModel[] = await this.userMediaModel.find({
      businessId: business.id,
    })
    .populate({
      match: {
        showOn: { $in: ['all', 'media'] },
      },
      path: userAttributeRefference,
      select: selectFields,
    })
    .populate({
      path: attributeRefference,
      select: selectFields,
    })
    .sort(sort)
    .skip(page.skip)
    .limit(page.limit)
    .exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async findWithNoAlbumByBusinessId(
    pagination: PaginationDto,
    business: BusinessModel,
  ): Promise<UserMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const data: UserMediaModel[] = await this.userMediaModel.find({
      album: { $exists: false },
      businessId: business.id,
    })
    .populate({
      match: {
        showOn: { $in: ['all', 'media'] },
      },
      path: userAttributeRefference,
      select: selectFields,
    })
    .populate({
      path: attributeRefference,
      select: selectFields,
    })
    .sort(sort)
    .skip(page.skip)
    .limit(page.limit)
    .exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async searchMedia(
    search: SearchMediaDto,
    business: BusinessModel,
  ): Promise<UserMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(search);
    const sort: any = PaginationHelper.getSortQuery(search);

    return this.userMediaModel.find({
      $and: [
        { name: { $regex: search.name, $options: 'i' } },
        { businessId: business.id },
      ],
    })
    .sort(sort)
    .skip(page.skip).limit(page.limit)
    .exec();
  }

  public async findByBusinessAndAlbumId(
    pagination: PaginationDto,
    business: BusinessModel,
    userAlbum: UserAlbumModel,
  ): Promise<UserMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const data: UserMediaModel[] = await this.userMediaModel.find({
      $and: [
        { album: userAlbum.id },
        { businessId: business.id },
      ],
    })
    .populate({
      match: {
        showOn: { $in: ['all', 'album'] },
      },
      path: userAttributeRefference,
      select: selectFields,
    }).populate({
      path: attributeRefference,
      select: selectFields,
    })
    .sort(sort)
    .skip(page.skip)
    .limit(page.limit)
    .exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async findByUserAttribute(
    pagination: PaginationDto,
    business: BusinessModel,
    userAttributeId: string,
    userAttributeValue: string,
  ): Promise<UserMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const userAttribute: UserAttributeModel
      = await this.userAttributeService.findByIdAndBusiness(userAttributeId, business.id);

    if (!userAttribute || userAttribute.filterAble === false) {
      return ;
    }

    const data: UserMediaModel[] = await this.userMediaModel.find({
      $and: [
        { 'userAttributes.attribute': userAttributeId },
        { 'userAttributes.value': userAttributeValue },
      ],
    })
    .populate({
      match: {
        showOn: { $in: ['all', 'media'] },
      },
      path: userAttributeRefference,
      select: selectFields,
    }).populate({
      path: attributeRefference,
      select: selectFields,
    })
    .sort({ updatedAt: -1 })
    .skip(page.skip).limit(page.limit).exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async findByMultipleUserAttributes(
    pagination: PaginationDto,
    business: BusinessModel,
    userAttributeFilter: AttributeFilterDto,
  ): Promise<UserMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    userAttributeFilter
      = await this.userAttributeService.filterAttributeByFilterAbleOnly(business, userAttributeFilter);

    const filter: any[] = AttributeHelper.filterUserAttribute(userAttributeFilter);

    const data: UserMediaModel[] = await this.userMediaModel.find({
        $and: filter,
      })
      .populate({
        match: {
          showOn: { $in: ['all', 'media'] },
        },
        path: userAttributeRefference,
        select: selectFields,
      }).populate({
        path: attributeRefference,
        select: selectFields,
      })
      .sort(sort)
      .skip(page.skip).limit(page.limit).exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async deleteMany(
    dto: IdsDto,
  ): Promise<void> {
    const mediaList: UserMediaModel[] = await this.userMediaModel.find({
      _id: { $in: dto.ids } ,
    }).exec();

    for (const media of mediaList) {
      await this.businessMediaMessagesProducer.sendMediaDeletedMessage(media);
    }

    await this.userMediaModel.deleteMany({
      $and: [
        { _id: { $in: dto.ids } },
      ],
    }).exec();
  }

  public async addMultipleMediaToAlbum(
    albumId: string,
    dto: IdsDto,
    business: BusinessModel,
  ): Promise<void> {
    await this.userMediaModel.updateMany(
      {
        $and: [
          { _id: { $in: dto.ids } },
          { businessId: business.id },
        ],
      },
      {
        $set: {
          album: albumId,
        },
      },
    ).exec();
  }

  public async removeMultipleMediaFromAlbum(
    dto: IdsDto,
  ): Promise<void> {
    await this.userMediaModel.updateMany(
      {
        $and: [
          { _id: { $in: dto.ids } },
        ],
      },
      {
        $set: {
          album: null,
        },
      },
    ).exec();
  }

  public async saveMediasUploaded(
    userMedias: UserMediaUploadedInterface[],
    businessId: string,
    baseUrl: string,
  ): Promise<BlobInterface[]> {
    const blobs: BlobInterface[] = [];

    for (const userMedia of userMedias) {
      const mediaBlob: BlobInterface =
        await this.mediaUploadService.parseNameAndType(baseUrl + userMedia.blobName);
      const mediaType: MediaTypeEnum = MediaTypeHelper.getMediaType(mediaBlob.type);
      const data: UserMediaDto = {
        businessId: businessId,
        mediaType: mediaType,
        name: mediaBlob.name,
        url: `${baseUrl}${userMedia.blobName}`,
      };
      await this.create(businessId, data, []);
      mediaBlob.url = `${baseUrl}${userMedia.blobName}`;
      blobs.push(mediaBlob);
    }

    return blobs;
  }

  public async duplicate(
    business: BusinessModel,
    dto: DuplicateMediaDto,
  ): Promise<UserMediaModel[]> {
    const userMediaModels: UserMediaModel[] = await this.userMediaModel.find(
      {
        _id: { $in: dto.userMediaIds },
        businessId: business._id,
      },
    ).exec();

    const resultModels: UserMediaModel[] = [];

    for (const userMedia of userMediaModels) {
      const copyObj: any = userMedia.toObject();
      delete copyObj._id;
      const nameCounter: number =
        await this.counterService.getNextCounter(business._id, userMedia.name, 'userMedia-name');

      copyObj.name = userMedia.name + `-${dto.prefix ? dto.prefix : 'copy'}-${nameCounter}`;
      copyObj.album = dto.album || dto.album === null ? dto.album : copyObj.album;

      const userMediaCopy: UserMediaModel = await this.userMediaModel.create(copyObj);
      resultModels.push(userMediaCopy);
    }

    return resultModels;
  }

  public async move(
    business: BusinessModel,
    dto: MoveMediaDto,
  ): Promise<UserMediaModel[]> {
    await this.userMediaModel.updateMany(
      {
        _id: { $in: dto.userMediaIds },
        businessId: business._id,
      },
      {
        $set: {
          album: dto.album,
        },
      },
    ).exec();

    return this.userMediaModel.find(
      {
        _id: { $in: dto.userMediaIds },
        businessId: business._id,
      },
    );
  }

  private async generateDefaultName(businessId: string): Promise<string> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) {
      return ;
    }
    const count: number = await this.userMediaModel.count({
      businessId: business._id,
    }).exec();

    return business.name + `_${(count + 1)}`;
  }

  private attributeGqlMap(attribute: any): { name: string; value: any } {
    return {
      name: attribute.attribute?.name,
      value: attribute.value,
    };
  }
}
