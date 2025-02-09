import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';
import { Roles, RolesEnum } from '@pe/nest-kit';
import { ServiceExceptionFilter } from '../../graphql/resolvers/service.exception.filter';
import { PaginationDto } from '../../dto';
import { ProductService } from '../../services';

@Resolver()
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.anonymous)
export class CategoriesResolver extends AbstractGqlResolver {
  constructor(
    private readonly productService: ProductService,
  ) {
    super();
  }

  @Query()
  public async getUsedCategoriesForBuilder(
    @Args('filter') filter: string,
    @Args('business') businessId?: string,
    @Args('order') order?: string,
    @Args('pageNumber') pageNumber?: number,
    @Args('paginationLimit') paginationLimit?: number,
  ): Promise<any> {
    const pagination: PaginationDto = {
      limit: paginationLimit || 100,
      page: pageNumber || 1,
    };

    return this.productService.getUsedBuilderCategories(businessId, filter, order, pagination);
  }

  @Query()
  public async getCategoriesByProductsForBuilder(
    @Args('filter') filter: string,
    @Args('business') business?: string,
    @Args('order') order?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.productService.getBuilderCategoriesByProducts(business, filter, order, offset, limit);
  }
}
