import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CollectionSchemaName } from '../schemas';
import { Query, Model } from 'mongoose';
import { CollectionModel } from '../models';
import {
  AdminCreateCollectionDto,
  CollectionQueryDto,
  CopyCollectionDto,
  CreateCollectionDto,
  GetCollectionsListDto,
  GetPaginatedListQueryDto,
  PaginatedCollectionsListDto,
  PaginatedListInfoDto,
  UpdateCollectionDto,
} from '../dto';
import { SlugHelper } from '../helpers';
import { EventDispatcher } from '@pe/nest-kit';
import { CollectionEventsEnum } from '../enums';
import { AlbumModel } from '../../album/models';
import { AncestorHelper } from '../../common/helpers';
import { CounterService } from '../../counter/services';
import { PaginationDto, SortDto } from '../../products/dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(CollectionSchemaName) private readonly collectionModel: Model<CollectionModel>,
    @InjectModel('ProductBase') private readonly productModel: Model<any>,
    private readonly counterService: CounterService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async getByIdAndBusiness(id: string, businessId: string): Promise<CollectionModel> {
    return this.collectionModel.findOne({
      _id: id,
      businessId: businessId,
    });
  }

  public async getById(id: string): Promise<CollectionModel> {
    return this.collectionModel.findOne({ _id: id });
  }

  public async getListByBusinessId(businessId: string): Promise<CollectionModel[]> {
    return this.collectionModel.find({ businessId: businessId });
  }

  public async create(createCollectionDto: CreateCollectionDto, businessId: string): Promise<CollectionModel> {
    const parentModel: CollectionModel = await this.collectionModel.findOne(
      {
        _id: createCollectionDto.parent,
        businessId: businessId,
      },
    );

    if (!parentModel) {
      createCollectionDto.parent = null;
    }

    if (!createCollectionDto.slug) {
      createCollectionDto.slug = SlugHelper.getSlug(createCollectionDto.name);
    }

    const collection: CollectionModel = await this.collectionModel.create({
      ...createCollectionDto,
      ancestors: AncestorHelper.buildAncestors(parentModel),
      businessId: businessId,
    } as CollectionModel);

    await this.eventDispatcher.dispatch(CollectionEventsEnum.CollectionCreated, collection);

    return collection;
  }

  public async copy(copyCollectionDto: CopyCollectionDto, businessId: string): Promise<PaginatedCollectionsListDto> {
    if (copyCollectionDto.collectionIds.includes(copyCollectionDto.parent)) {
      throw new BadRequestException(`Wrong request: cannot copy to itself`);
    }

    const parentModel: CollectionModel = await this.collectionModel.findOne(
      {
        _id: copyCollectionDto.parent,
        businessId: businessId,
      },
    );

    // validate parent model
    if (parentModel) {
      const intersect: string[] =
        parentModel.ancestors.filter((value: string) => copyCollectionDto.collectionIds.includes(value));
      if (intersect.length > 0) {
        throw new BadRequestException(`Wrong request: cannot target parent from its own child`);
      }
    }

    const collectionModels: CollectionModel[] = await this.collectionModel.find(
      {
        _id: { $in: copyCollectionDto.collectionIds },
        businessId: businessId,
      },
    );

    const resultModels: CollectionModel[] = [];

    for (const collection of collectionModels) {
      const copyObj: any = collection.toObject();
      delete copyObj._id;
      const nameCounter: number =
        await this.counterService.getNextCounter(businessId, collection.name, 'collection-name');

      copyObj.name =
        collection.name + `-${copyCollectionDto.prefix ? copyCollectionDto.prefix : 'copy'}-${nameCounter}`;
      copyObj.slug = SlugHelper.getSlug(copyObj.name);
      copyObj.parent = parentModel ? copyCollectionDto.parent : null;
      copyObj.ancestors = AncestorHelper.buildAncestors(parentModel);
      const collectionCopy: CollectionModel = await this.collectionModel.create(copyObj);
      resultModels.push(collectionCopy);

      // process copy child
      const childs: CollectionModel[] = await this.collectionModel.find(
        {
          businessId: businessId,
          parent: collection.id,
        },
      ).select('_id');

      const childIds: string[] = childs.map((child: CollectionModel) => {
        return child.id;
      });

      await this.copy(
        {
          collectionIds: childIds,
          parent: collectionCopy.id,
          prefix: copyCollectionDto.prefix,
        },
        businessId,
      );
    }

    return {
      collections: resultModels,
      info: {
        pagination: {
          itemCount: resultModels.length,
          page: 1,
          pageCount: 1,
          perPage: resultModels.length,
        },
      },
    };
  }

  public async update(collection: CollectionModel, updateCollectionDto: UpdateCollectionDto): Promise<CollectionModel> {
    if (!updateCollectionDto.slug) {
      updateCollectionDto.slug = SlugHelper.getSlug(updateCollectionDto.name);
    }

    let automaticFillConditions: any = collection.automaticFillConditions;
    if (updateCollectionDto.automaticFillConditions) {
      automaticFillConditions = {
        filters: updateCollectionDto.automaticFillConditions.filters,
        manualProductsList: collection.automaticFillConditions.manualProductsList,
        strict: updateCollectionDto.automaticFillConditions.strict,
      };
    }

    let ancestorsUpdate: any = { };

    if (updateCollectionDto.parent || updateCollectionDto.parent === '') {
      const parentModel: AlbumModel = await this.collectionModel.findOne(
        {
          _id: updateCollectionDto.parent,
          businessId: collection.businessId,
        },
      );
      if (parentModel) {
        ancestorsUpdate = {
          ancestors: AncestorHelper.buildAncestors(parentModel),
        };
      } else {
        delete updateCollectionDto.parent;
      }
    }

    const updatedCollection: CollectionModel = await this.collectionModel.findOneAndUpdate(
      { _id: collection.id },
      {
        $set: {
          businessId: collection.businessId,
          ...updateCollectionDto,
          ...{
            automaticFillConditions,
          },
          ...ancestorsUpdate,
        },
      },
      {
        context: 'query',
        new: true,
        runValidators: true,
      },
    );

    if (updateCollectionDto.parent || updateCollectionDto.parent === '') {
      await this.updateChildrenAncestors(updatedCollection);
    }

    await this.eventDispatcher.dispatch(CollectionEventsEnum.CollectionUpdated, collection, updatedCollection);

    return updatedCollection;
  }

  public async delete(collection: CollectionModel): Promise<void> {
    const children: CollectionModel[] = await this.collectionModel.find({ parent: collection.id });
    for (const child of children) {
      await this.delete(child);
    }
    const removedCollection: CollectionModel = await this.collectionModel.findOneAndDelete({ _id: collection.id });
    await this.eventDispatcher.dispatch(CollectionEventsEnum.CollectionRemoved, removedCollection);
  }

  public async deleteList(collections: CollectionModel[]): Promise<void> {
    for (const collection of collections) {
      await this.delete(collection);
    }
  }

  public async getPaginatedListForBusiness(
    businessId: string,
    paginationQuery: GetPaginatedListQueryDto,
  ): Promise<PaginatedCollectionsListDto> {
    return this.getPaginatedList(
      { businessId: businessId },
      paginationQuery,
      null,
      true,
    );
  }

  public async getByParentForBusiness(
    businessId: string,
    paginationQuery: GetPaginatedListQueryDto,
    parent?: string,
  ): Promise<PaginatedCollectionsListDto> {
    const query: any = { businessId: businessId };
    if (parent) {
      query.parent = parent;
    } else {
      query.parent = null;
    }

    const select: string[] = ['_id', 'name', 'image', 'ancestors', 'parent', 'productCount'];

    return this.getPaginatedList(
      query,
      paginationQuery,
      select,
      true,
    );
  }

  public async getByAncestorForBusiness(
    businessId: string,
    paginationQuery: GetPaginatedListQueryDto,
    ancestor: string,
  ): Promise<PaginatedCollectionsListDto> {
    const query: any = {
      ancestors: ancestor,
      businessId: businessId,
    };

    return this.getPaginatedList(
      query,
      paginationQuery,
    );
  }

  public async getListById(ids: string[]): Promise<CollectionModel[]> {
    return this.collectionModel.find({
      _id: {
        $in: ids,
      },
    });
  }

  public async getPaginatedActiveList(
    getListDto: GetCollectionsListDto,
    businessId: string,
    channelSetId: string,
    paginationQuery: GetPaginatedListQueryDto,
  ): Promise<PaginatedCollectionsListDto> {
    const query: any = {
      businessId: businessId,
      channelSets: channelSetId,
    };

    if (getListDto.activeSince) {
      query.activeSince = { $lte: getListDto.activeSince };
    }

    if (getListDto.activeTill) {
      query.activeTill = { $gte: getListDto.activeTill };
    }

    return this.getPaginatedList(query, paginationQuery);
  }


  public async getForAdmin(query: CollectionQueryDto)
    : Promise<{ documents: CollectionModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    if (query.parent) {
      conditions.parent = query.parent;
    }

    if (query.ancestors) {
      conditions.ancestors = query.ancestors;
    }

    if (query.channelSets) {
      conditions.channelSets = query.channelSets;
    }

    const documents: CollectionModel[] = await this.collectionModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.collectionModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(createCollectionDto: AdminCreateCollectionDto): Promise<CollectionModel> {
    return this.create(createCollectionDto, createCollectionDto.businessId);
  }

  public async addManualProducts(collection: CollectionModel, ids: string[]): Promise<void> {
    await this.collectionModel.updateOne(
      { _id: collection.id},
      { $addToSet: { 'automaticFillConditions.manualProductsList': { $each: ids }} },
    );
  }

  public async getBuilderCollection(
    business: string,
    filter: any,
    order: any,
    offset: number = 0,
    limit: number = 100,
  ): Promise<any> {
    let filterData: any = filter ? filter : [ ];
    filterData = typeof filter === 'string' && filter !== '' ? JSON.parse(filter) : [ ];

    let result: PaginatedCollectionsListDto;
    const paginationQuery: GetPaginatedListQueryDto = {
      page: 1,
      perPage: limit,
      skip: offset,
    };

    switch (true) {
      case (filterData.field === `ancestors`):
        result = await this.getByAncestorForBusiness(business, paginationQuery, filterData.value);
        break;
      case (filterData.field === `parent`):
        result = await this.getByParentForBusiness(business, paginationQuery, filterData.value);
        break;
      case (filterData.field === `_id`):
        const collectionModel: CollectionModel = await this.getById(filterData.value);
        result = {
          collections: [collectionModel],
          info: null,
        };
        break;
      default:
        result = await this.getPaginatedList(
          { businessId: business },
          paginationQuery,
          null,
          true,
        );
        break;
    }

    return {
      result: result?.collections,
      totalCount: result?.info?.pagination?.itemCount ? result?.info?.pagination?.itemCount
        : result?.collections.length,
    };
  }

  public async getByQuery(
    query: object,
    pagination: PaginationDto = { page: 1, limit: 0 },
    sort: SortDto,
  ): Promise<CollectionModel[]> {
    const { page, limit }: { page: number; limit: number } = pagination;
    const skip: number = (page - 1) * limit;

    const listPromise: any = this.collectionModel
      .find(query)
      .skip(skip)
      .limit(limit);

    if (sort) {
      const orderBy: { [propName: string]: 1 | -1 } = { };
      orderBy[sort.field] = sort.direction === 'asc' ? 1 : -1;
      listPromise.sort(orderBy);
    }

    return listPromise;
  }

  private async getPaginatedList(
    query: any,
    pageDto: GetPaginatedListQueryDto,
    select: string[] = null,
    productCount: boolean = false,
  ): Promise<PaginatedCollectionsListDto> {
    const total: number = await this.collectionModel.find(query).countDocuments();
    pageDto.page = (!pageDto.page || pageDto.page < 1) ? 1 : pageDto.page;
    pageDto.perPage = (!pageDto.perPage || pageDto.perPage < 1) ? 10 : pageDto.perPage;
    let skip: number = (pageDto.page - 1) * pageDto.perPage;
    if (pageDto.skip) {
      skip = pageDto.skip;
    }

    const docQuery: Query<any, any> = this.collectionModel.find(query);

    if (select) {
      docQuery.select(select);
    }

    let collections: CollectionModel[] = await docQuery.skip(skip).limit(pageDto.perPage);

    if (productCount) {
      const collectionIds: string[] = collections.map((collection: CollectionModel) => collection._id);
      const aggregateData: any[] = await this.productModel.aggregate(
        [
          {
            '$match': {
              'collections': {
                '$in': collectionIds,
              },
            },
          },
          {
            '$unwind' : { 'path': '$collections' },
          },
          {
            '$group': {
              '_id': '$collections',
              'count': {
                '$sum': 1,
              },
            },
          },
        ],
      );

      const countData: { [key: string] : number} = { };

      for (const data of aggregateData) {
        countData[data._id] = data.count;
      }

      collections = collections.map((collection: CollectionModel) => {
        collection.productCount = countData[collection._id] ? countData[collection._id] : 0;

        return collection;
      });
    }

    return {
      collections,
      info: this.preparePaginationInfo(pageDto, total),
    };
  }

  private preparePaginationInfo(pageDto: GetPaginatedListQueryDto, total: number): PaginatedListInfoDto {
    return {
      pagination: {
        itemCount: total,
        page: pageDto.page,
        pageCount: Math.ceil(total / pageDto.perPage),
        perPage: pageDto.perPage,
      },
    };
  }

  private async updateChildrenAncestors(parent: CollectionModel): Promise<void> {
    const children: CollectionModel[] = await this.collectionModel.find(
      {
        parent: parent.id,
      },
    );

    for (const child of children) {
      const ancestor: string[] = AncestorHelper.buildAncestors(parent);

      await this.collectionModel.updateOne(
        {
          _id: child.id,
        },
        {
          $set: {
            ancestors: ancestor,
          },
        },
      );
      await this.updateChildrenAncestors(child);
    }
  }
}
