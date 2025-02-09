import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProductModel, ProductRecommendationsModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { FoldersService, FolderTreeItemInterface } from '@pe/folders-plugin';
import {
  PaginationDto,
  ProductRecommendationDto,
  ProductCategoryDto,
  SortDto,
  SortDirectionEnum,
  RecommendationItemDto,
} from '../dto';
import { ProductsPaginatedInterface } from '../interfaces';
import { ProductService, ProductCategoriesService } from '.';
import { RecommendationTagsEnum } from '../enums';
import { CollectionsService } from '../../categories/services';
import { CollectionModel } from '../../categories/models';
import { GetPaginatedListQueryDto, PaginatedCollectionsListDto } from '../../categories/dto';

@Injectable()
export class ProductRecommendationsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
    @InjectModel('ProductRecommendations') private readonly recommendationsModel: Model<ProductRecommendationsModel>,
    private readonly productService: ProductService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly collectionsService: CollectionsService,
    private readonly foldersService: FoldersService,
  ) { }

  public async getProductRecommendations(
    productId: string,
  ): Promise<ProductRecommendationDto> {
    return this.recommendationsModel.findOne({ productId });
  }

  public async getRecommendations(
    businessId: string,
    tagFilter: string = '',
    pagination: PaginationDto = { limit: 0, page: 1 },
  ): Promise<ProductRecommendationDto[]> {
    const result: ProductRecommendationDto[] = [];

    await Promise.all([
      this.getCategories(businessId, pagination, tagFilter, result),
      this.getProducts(businessId, pagination, tagFilter, result),
      this.getFolders(businessId, result),
    ]);


    return result;
  }

  private async getCategories(
    businessId: string,
    pagination: PaginationDto,
    tagFilter: string,
    result: ProductRecommendationDto[],
  ): Promise<void> {
    if (tagFilter && tagFilter !== RecommendationTagsEnum.byCategory) {
      return;
    }

    const categories: ProductCategoryDto[] = await this.productCategoriesService.getCategories(
      businessId,
      '',
      pagination,
    );

    result.push(
      {
        recommendations: categories.map((category: ProductCategoryDto) => ({ id: category.id, name: category.title})),
        tag: RecommendationTagsEnum.byCategory,
      },
    );
  }

  private async getProducts(
    businessId: string,
    pagination: PaginationDto,
    tagFilter: string,
    result: ProductRecommendationDto[],
  ): Promise<void> {
    if (tagFilter && tagFilter !== RecommendationTagsEnum.byProduct) {
      return;
    }

    const query: { businessId: string } = { businessId };
    const sort: SortDto = {
      direction: SortDirectionEnum.ASC,
      field: 'title',
    };
    const paginatedProducts: ProductsPaginatedInterface = await this.productService.getProductsPaginated(
      query,
      pagination,
      sort,
    );

    result.push(
      {
        recommendations: paginatedProducts.products.map(
          (product: ProductModel) => (
            {
              id: product.id,
              images: product.images,
              name: product.title,
              sku: product.sku,
            }
          ),
        ),
        tag: RecommendationTagsEnum.byProduct,
      },
    );
  }

  private async getCollections(
    businessId: string,
    pagination: PaginationDto,
    tagFilter: string,
    result: ProductRecommendationDto[],
  ): Promise<void> {
    if (tagFilter && tagFilter !== RecommendationTagsEnum.byCollection) {
      return;
    }

    const paginatedQuery: GetPaginatedListQueryDto = {
      page: pagination.page,
      perPage: pagination.limit,
    };
    const collectionsPaginated: PaginatedCollectionsListDto = await this.collectionsService.getPaginatedListForBusiness(
      businessId,
      paginatedQuery,
    );

    result.push(
      {
        recommendations: collectionsPaginated.collections.map(
          (collection: CollectionModel) => (
            { id: collection.id, name: collection.name}
          ),
        ),
        tag: RecommendationTagsEnum.byCollection,
      },
    );
  }

  private async getFolders(businessId: string, result: ProductRecommendationDto[]): Promise<void> {
    const items: RecommendationItemDto[] = [];
    const foldersTree: FolderTreeItemInterface[] = await this.foldersService.getRootTree(businessId);
    function walk(path: string, current: FolderTreeItemInterface): void {
      items.push({
        id: current._id,
        name: `${path}/${current.name}`,
      });
      for (const child of current.children || []) {
        walk(`${path}/${child.name}`, child);
      }
    }

    for (const item of foldersTree) {
      walk('', item);
    }

    result.push({
      recommendations: items,
      tag: RecommendationTagsEnum.byFolder,
    });
  }
}
