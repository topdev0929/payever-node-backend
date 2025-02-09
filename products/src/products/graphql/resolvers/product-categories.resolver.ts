// DEPRECATED: use the one in categories module

import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { ProductCategoriesService, ProductService } from '../../services';
import { PaginationDto, ProductCategoryDto } from '../../dto';
import { CategoryInput } from '../graphql.schema';
import { ProductCategoryModel } from '../../models';

interface GetCategoriesRequestInterface {
  businessUuid: string;
  filter?: string;
  pagination?: PaginationDto;
}

@Resolver()
export class ProductCategoriesResolver {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly productService: ProductService,
  ) { }

  @Query()
  public async getCategories(
    @Args('businessUuid') businessUuid: string,
    @Args('title') title?: string,
    @Args('pageNumber') pageNumber?: number,
    @Args('paginationLimit') paginationLimit?: number,
  ): Promise<ProductCategoryDto[]> {
    const pagination: PaginationDto = {
      limit: paginationLimit || 100,
      page: pageNumber || 1,
    };

    return this.productCategoriesService.getCategories(businessUuid, title, pagination);
  }

  @Query()
  public async getUsedCategories(_: any, data: GetCategoriesRequestInterface): Promise<ProductCategoryDto[]> {
    return this.productService.getUsedProductCategories(data.businessUuid, data.filter);
  }

  @Mutation('createCategory')
  public async createCategory(
    @Args({ name: 'category', type: (): any => Object }) data: CategoryInput,
  ): Promise<ProductCategoryDto> {
    const { businessUuid, title }: any = data;

    const category: ProductCategoryModel = await this.productCategoriesService.createCategory(businessUuid, title);

    return {
      businessId: category.businessId,
      businessUuid: category.businessId,
      id: category.id,
      slug: category.slug,
      title: category.title,
    };
  }
}
