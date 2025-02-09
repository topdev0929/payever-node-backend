import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductInterface, ProductsService } from '@pe/subscriptions-sdk/modules';
import { Model } from 'mongoose';
import {
  AttributeFilterDto,
  BuilderSubscriptionMediasDto,
  FilterDto,
  GetSubscriptionMediaWithFilterDto,
  PaginationDto,
  SearchMediaDto,
  SubscriptionMediaDto,
  SubscriptionMediaListDto,
} from '../dto';
import {
  ElasticIndexEnum,
  ImageExtentionEnum,
  MediaOwnerTypeEnum,
  MediaTypeEnum,
  SubscriptionMediaTypeEnum,
  VideoExtentionEnum,
} from '../enums';
import { PaginationHelper } from '../helpers';
import { PaginationInterface, SubscriptionMediaUploadedInterface } from '../interfaces';
import { AttributeModel, SubscriptionMediaModel } from '../models';
import { SubscriptionMediaSchemaName } from '../schemas';
import { BlobInterface } from '../interfaces/blob.interface';
import { MediaUploadService } from './media-upload.service';
import { MediaInfoTaskService } from './media-info-task.service';
import { environment } from '../../environments';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import * as lockFile from 'lockfile';
import { AttributeService } from './attribute.service';
import { QueryBuilderEsService } from './query-builder-es.service';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { SubscriptionMediaMessagesProducer } from '../producers';

const lock: string = 'subscription-media-compress.lockfile';

const attributeRefference: string = 'attributes.attribute';
const selectAttributeFields: string = 'icon name type';

@Injectable()
export class SubscriptionMediaService {
  constructor(
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
    private readonly productsService: ProductsService,
    private readonly mediaUploadService: MediaUploadService,
    private readonly mediaInfoTaskService: MediaInfoTaskService,
    private readonly httpService: HttpService,
    private readonly attributeService: AttributeService,
    private readonly queryBuilderEsService: QueryBuilderEsService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly subscriptionMediaMessagesProducer: SubscriptionMediaMessagesProducer,
    private readonly logger: Logger,
  ) { }

  public async findAll(skip: number, limit: number): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaModel.find().populate(attributeRefference)
      .sort({ updatedAt: -1 }).skip(skip).limit(limit);
  }

  public async findByUrlAndUpdateOrInsert(
    dto: SubscriptionMediaDto,
  ): Promise<SubscriptionMediaModel> {
    if (!dto.subscriptionType) {
      dto.subscriptionType = SubscriptionMediaTypeEnum.free;
    } else {
      dto.subscriptionType = parseInt(SubscriptionMediaTypeEnum[dto.subscriptionType], 10);
    }

    const data: SubscriptionMediaModel = await this.subscriptionMediaModel.findOneAndUpdate(
      {
        url: dto.url,
      },
      {
        $set: dto,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).populate({
      path: attributeRefference,
      select: selectAttributeFields,
    }).exec();

    await this.subscriptionMediaMessagesProducer.sendMediaUpsertMessage(data);

    if (data.mediaType === MediaTypeEnum.IMAGE) {
      // todo: wait image assessment nima wrapper to other pods
      // const imageAssessmentTask: ImageAssessmentTaskInterface = {
      //   mediaId: data.id,
      //   status: TaskStatusEnum.waiting,
      //   tries: 0,
      //   type: MediaOwnerTypeEnum.SUBSCRIPTION,
      //   url: data.url,
      // };
      //
      // await this.imageAssessmentTaskService.create(imageAssessmentTask);
    }
    await this.mediaInfoTaskService.create(data._id, data.url, MediaOwnerTypeEnum.SUBSCRIPTION, data.mediaType);

    return data;
  }

  public async updateById(id: string, data: any): Promise<SubscriptionMediaModel> {
    const media: SubscriptionMediaModel = await this.subscriptionMediaModel.findOneAndUpdate(
      { _id: id },
      {
        $set: data,
      },
      {
        new: true,
        upsert: false,
      },
    );
    await this.subscriptionMediaMessagesProducer.sendMediaUpsertMessage(media);

    return media;
  }

  public async findBuilderSubscriptionMedia(
    userId: string,
    filter: any,
    order: any,
    offset: number,
    limit: number,
  ): Promise<BuilderSubscriptionMediasDto> {
    offset = offset ? offset : 0;
    limit = limit ? limit : 10;

    const builderFilter: any = filter ? filter : [];
    const orderJson: any[] = order ? order : [];
    const esSorts: any = [];
    for (const sub of orderJson) {
      const sort: any = { };
      sort[sub.field] = sub.direction;
      esSorts.push(sort);
    }

    const esQuery: any = await this.queryBuilderEsService.buildQuery((builderFilter));
    esQuery.query.bool.must.push({ term: { subscriptionType: 0 } });
    esQuery.sort = esSorts;
    esQuery.from = offset;
    esQuery.size = limit;

    const results: any = await this.elasticSearchClient.search(
      ElasticIndexEnum.subscriptionMedia,
      esQuery,
    );

    return {
      result: results && results.body && results.body.hits && Object(results.body.hits.total).value > 0
        ? results.body.hits.hits.map((item: { _source: any}) => {
          return {
            ...item._source,
            id: item._source.mongoId,
          };
        })
        : [],
      totalCount: results && results.body && results.body.hits ? Object(results.body.hits.total).value : 0,
    };
  }

  public async findSubscriptionMediaByUserId(
    userId: string,
    pagination: PaginationDto,
    attributeId?: string,
    attributeValue?: string,
    folderId?: string,
  ): Promise<SubscriptionMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const querySubscription: any = await this.querySubscription(
      userId,
      attributeId,
      attributeValue,
      folderId,
    );

    return this.querySubscriptionMedia(querySubscription, page, sort);
  }

  public async findSubscriptionMedia(
    pagination: PaginationDto,
    folderId: string = null,
  ): Promise<SubscriptionMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const query: any = folderId ? { 'parentFolder': folderId } : { };

    return  this.subscriptionMediaModel.find(query)
    .populate({
      path: attributeRefference,
      select: selectAttributeFields,
    })
    .sort(sort)
    .skip(page.skip).limit(page.limit);
  }

  public async findBySubscriptionType(
    pagination: PaginationDto,
    subscriptionType: string,
  ): Promise<SubscriptionMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);
    const subscriptionTypeLevel: number = parseInt(SubscriptionMediaTypeEnum[subscriptionType], 10);
    const querySubscription: any = { subscriptionType: subscriptionTypeLevel };

    return this.querySubscriptionMedia(querySubscription, page, sort);
  }

  public async remove(docs: SubscriptionMediaModel): Promise<void> {
    await this.subscriptionMediaMessagesProducer.sendMediaDeletedMessage(docs);
    await this.subscriptionMediaModel.deleteOne({ _id: docs._id }).exec();
  }

  public async findByAttribute(
    pagination: PaginationDto,
    attributeId: string,
    attributeValue: string,
  ): Promise<SubscriptionMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    return this.subscriptionMediaModel.find({
      $and: [
        { 'attributes.attribute': attributeId },
        { 'attributes.value': attributeValue },
      ],
    })
    .populate({
      path: attributeRefference,
      select: selectAttributeFields,
    })
    .sort(sort)
    .skip(page.skip).limit(page.limit);
  }

  public async findByGetMultipleAttributes(
    dto: GetSubscriptionMediaWithFilterDto,
  ): Promise<SubscriptionMediaListDto> {
    dto.limit = dto.limit ? dto.limit : 10;
    dto.offset = dto.offset ? dto.offset : 0;
    const filters: FilterDto[] = dto.filters ? dto.filters : [];

    const query: any = [];
    for (const filter of filters) {
      const attribute: AttributeModel = await this.attributeService.findOneByNameAndType(filter.field, 'dropbox');
      switch (true) {
        case (filter.condition === 'is'):
          query.push({ attributes: { attribute: attribute._id, value: filter.value } });
          break;
        case (filter.condition === 'isNot'):
          query.push({ attributes : { $elemMatch: { attribute: attribute._id, value: { $ne: filter.value } } } });
          break;
        case (filter.condition === 'in'):
          query.push({ attributes : { $elemMatch: { attribute: attribute._id, value: { $in: filter.value } } } });
          break;
        case (filter.condition === 'notIn'):
          query.push({ attributes : { $elemMatch: { attribute: attribute._id, value: { $nin: filter.value } } } });
          break;
        default:
          break;
      }
    }

    const andQuery: any = query && query.length > 0 ? { $and : query } : { };

    const list: SubscriptionMediaModel[] = await this.subscriptionMediaModel.find(andQuery)
      .populate(attributeRefference)
      .sort({ sortBy : -1 })
      .skip(dto.offset)
      .limit(dto.limit)
      .exec();

    const count: number = await this.subscriptionMediaModel.count(andQuery).exec();

    return {
      limit: dto.limit,
      list: list,
      offset: dto.offset,
      total: count,
    };
  }

  public async findByMultipleAttributes(
    pagination: PaginationDto,
    attributeFilter: AttributeFilterDto,
  ): Promise<SubscriptionMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const filter: any[] = [];
    attributeFilter.attributes.forEach((element: any) => {
      filter.push({
        $and: [
          { 'attributes.attribute': element.attribute },
          { 'attributes.value': element.value },
        ],
      });
    });

    return this.subscriptionMediaModel.find({
      $and: filter,
    })
    .populate({
      path: attributeRefference,
      select: selectAttributeFields,
    })
    .sort(sort)
    .skip(page.skip).limit(page.limit);
  }

  public async searchMedia(
    search: SearchMediaDto,
  ): Promise<SubscriptionMediaModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(search);

    return this.subscriptionMediaModel.find({ name: { $regex: search.name, $options: 'i' } })
    .populate({
      path: attributeRefference,
      select: selectAttributeFields,
    })
    .sort({ updatedAt: -1 })
    .skip(page.skip).limit(page.limit);
  }

  public async searchMediaByUserId(
    userId: string,
    search: SearchMediaDto,
  ): Promise<SubscriptionMediaModel[]> {
    const subscriptionTypeLevel: number = await this.getUserSubscription(userId);
    const page: PaginationInterface = PaginationHelper.getPagination(search);
    const querySubscription: any = { subscriptionType: { $lte: subscriptionTypeLevel } };

    return this.subscriptionMediaModel.find(
      {
        $and: [
          { name: { $regex: search.name, $options: 'i' } },
          querySubscription,
        ],
      },
    )
    .populate({
      path: attributeRefference,
      select: selectAttributeFields,
    })
    .sort({ updatedAt: -1 })
    .skip(page.skip).limit(page.limit);
  }

  public async saveMediasUploaded(
    subscriptionMedias: SubscriptionMediaUploadedInterface[],
  ): Promise<BlobInterface[]> {
    const blobs: BlobInterface[] = [];

    for (const subscriptionMedia of subscriptionMedias) {
      const mediaBlob: BlobInterface = await this.mediaUploadService.parseNameAndType(subscriptionMedia.url);
      const mediaType: MediaTypeEnum =
        ((Object as any).values(ImageExtentionEnum).includes(mediaBlob.type)) ? MediaTypeEnum.IMAGE :
        ((Object as any).values(VideoExtentionEnum).includes(mediaBlob.type)) ? MediaTypeEnum.VIDEO : null;
      const data: SubscriptionMediaDto = {
        mediaType: mediaType,
        name: mediaBlob.name,
        url: subscriptionMedia.url,
      };

      await this.findByUrlAndUpdateOrInsert(data);
      mediaBlob.url = subscriptionMedia.url;
      blobs.push(mediaBlob);
    }

    return blobs;
  }

  public async compressTrigger(): Promise<void> {
    lockFile.check(lock, { }, async (error: any, isLocked: any) => {
      if (error) {
        return;
      }
      if (isLocked) {
        this.logger.log(lock + ' is locked');
      } else {
        await this.compressLock();
      }
    });
  }

  public async compress(): Promise<void> {
    const medias: SubscriptionMediaModel[] = await this.subscriptionMediaModel.find(
      {
        $and: [
          {
            $or : [
              { compressed: false },
              { compressed: { $exists : false } },
            ],
          },
          {
            $or : [
              { compressionTries: 0 },
              { compressionTries: { $exists : false } },
            ],
          },
        ],
      },
    ).limit(5).exec();
    if (medias.length === 0) {
      return ;
    }

    const promise: any[] = [];
    for (const media of medias) {
      promise.push(this.compressingMedia(media));
    }
    await Promise.all(promise);

    await this.compress();
  }

  private async compressingMedia(media: SubscriptionMediaModel): Promise<any> {
    try {
      await this.compressRequest(media);
      await media.update(
        {
          $set: {
            compressed: true,
          },
        },
      ).exec();
    } catch (e) {
      this.logger.log(e);
      await media.update(
        {
          $inc: {
            compressionTries: 1,
          },
        },
      ).exec();
    }
  }

  private async compressRequest(media: SubscriptionMediaModel): Promise<any> {
    this.logger.log(`Compressing ${media.url}`);
    const url: string = environment.mediaServiceUrl + `/api/storage/compress`;
    const response: Observable<any> = this.httpService.post(
      url,
      {
        container: 'miscellaneous',
        filename: this.regexGetName(media.url),
      },
    );

    return response.pipe(
      map(async (res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        this.logger.error(
          {
            error: error,
            message: 'failed to compress',
            url: url,
          },
        );

        throw error;
      }),
    ).toPromise();
  }

  private regexGetName(name: string): string {
    const regex: RegExp = /.+\/(.+)/;
    const found: string[] = name.match(regex);

    return found[1];
  }

  private async getUserSubscription(userId: string): Promise<number> {
    let subscriptionTypeLevel: number;
    const product: ProductInterface[] = await this.productsService.getAvailableProducts(userId);

    // todo: remove default level 0 if this subscription product really implemented
    if (product.length === 0) {
      subscriptionTypeLevel = 0;
    } else {
      const subscriptionType: SubscriptionMediaTypeEnum = product[0].features.name;
      subscriptionTypeLevel = parseInt(SubscriptionMediaTypeEnum[subscriptionType], 10);
    }

    return subscriptionTypeLevel;
  }

  private async compressLock(): Promise<void> {
    lockFile.lock(lock, { }, async (error2: any) => {
      if (error2) {
        return;
      }
      try {
        await this.compress();
      } catch (e) {
        this.logger.error(e);
      }
      lockFile.unlock(lock, (error3: any) => {
        if (error3) {
          return;
        }
      });
    });
  }

  private async querySubscriptionMedia(
    query: any,
    page: PaginationInterface,
    sort: any,
  ): Promise<SubscriptionMediaModel[]> {
    let result: SubscriptionMediaModel[];

    try {
      result = await this.subscriptionMediaModel.find(query)
      .populate({
        path: attributeRefference,
        select: selectAttributeFields,
      })
      .sort(sort)
      .skip(page.skip).limit(page.limit).exec();
    } catch (error) {
      this.logger.log(`Error: ${error}`);
    }

    return result;
  }

  private async querySubscription(
    userId: string,
    attributeId?: string,
    attributeValue?: string,
    folderId?: string,
  ): Promise<any> {
    const subscriptionTypeLevel: number = await this.getUserSubscription(userId);
    let querySubscription: any = { subscriptionType: { $lte: subscriptionTypeLevel } };

    if (attributeId && attributeValue) {
      querySubscription = {
        $and: [
          { 'attributes.attribute': attributeId },
          { 'attributes.value': attributeValue },
          querySubscription,
        ],
      };
    }

    if (folderId) {
      querySubscription = {
        $and: [
          { 'parentFolder': folderId },
          querySubscription,
        ],
      };
    }

    return querySubscription;
  }
}
