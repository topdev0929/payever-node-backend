import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { AccessTokenPayload, Roles, RolesEnum } from '@pe/nest-kit';
import { AbstractGqlResolver, GqlAuthGuard, GqlUser } from '@pe/graphql-kit';
import { ChannelRulesValidatePipe } from '@pe/products-sdk';
import { PaginationDto, ProductDto, SortDirectionEnum, SortDto } from '../../dto';
import { FilterDto } from '../../dto/filter.dto';
import { ProductChannelSetInterface, ProductMarketplaceInterface, ProductsPaginatedInterface } from '../../interfaces';
import { FilterInterface } from '../../../common/interfaces';
import { PopulatedVariantsCollectionsProductModel, ProductModel } from '../../models';
import { ProductVariantModel } from '../../models/product-variant.model';
import { FilterService, ProductsElasticService, ProductService } from '../../services';
import { ProductVariantsService } from '../../services/product-variants.service';
import { ProductCreateVoter, ProductDeleteVoter, ProductUpdateVoter } from '../../voters';
import { Product } from '../graphql.schema';
import { ParseSortDirPipe } from '../pipes/parse-sort-dir.pipe';
import { ServiceExceptionFilter } from './service.exception.filter';

interface UpdateChannelSetsPayload {
  business: string;
  channelSets: ProductChannelSetInterface[];
  addToProductIds: string[];
  deleteFromProductIds: string[];
}

interface UpdateMarketplacePayload {
  marketplaces: ProductMarketplaceInterface[];
  addToProductIds: string[];
  deleteFromProductIds: string[];
}

@Resolver('Product')
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.anonymous)
export class ProductsResolver extends AbstractGqlResolver {
  constructor(
    private readonly productsService: ProductService,
    private readonly variantsService: ProductVariantsService,
    private readonly productsElasticService: ProductsElasticService,
    private readonly filterService: FilterService,
  ) { super(); }

  @ResolveField()
  public async variants(@Parent() product: ProductModel): Promise<ProductVariantModel[]> {
    return Promise.all(
      ((product.variants || ([] as unknown)) as string[]).map((x: string) => this.variantsService.getVariant(x)),
    );
  }

  // tslint:disable-next-line: parameters-max-number
  @Query() public async getProducts(
    @Args('paginationLimit') paginationLimit: number,
    @Args({ name: 'orderDirection', type: (): any => SortDirectionEnum }, ParseSortDirPipe)
      orderDirection: SortDirectionEnum,
    @Args('businessUuid') businessUuid?: string,
    @Args('pageNumber') pageNumber?: number,
    @Args('orderBy') orderBy?: string,
    @Args('includeIds') includeIds?: string[],
    @Args('withMarketplaces') withMarketplaces: boolean = false,
    @Args({ name: 'filterById', type: (): any => [String] }) filterById?: string[],
    @Args('search') search?: string,
    @Args({ name: 'filters', type: (): any => [Object] }) filters?: FilterInterface[],
    @Args('useNewFiltration') useNewFiltration: boolean = false,
  ): Promise<ProductsPaginatedInterface | ProductsPaginatedInterface<PopulatedVariantsCollectionsProductModel>> {
    const pagination: PaginationDto = {
      limit: paginationLimit,
      page: pageNumber || 1,
    };

    const sortBy: SortDto = {
      direction: orderDirection,
      field: orderBy,
    };

    const filter: FilterDto = {
      excludeIds: filterById,
      filters: filters,
      includeIds,
      search: search,
      withMarketplaces,
    };

    return useNewFiltration
      ? this.productsElasticService.searchProducts(businessUuid, sortBy, pagination, filter)
      : this.productsService.getProducts(businessUuid, [sortBy], pagination, filter);
  }

  @Query()
  public async lastProductBusinessUpdatedAt(
      @Args('business') business?: string,
  ): Promise<any> {
    return this.productsService.lastProductBusinessUpdatedAt(business);
  }


  @Query()
  public async listProductIdsByBusiness(
      @Args('business') business?: string,
  ): Promise<any> {
    return this.productsService.listProductIdsByBusiness(business);
  }

  @Query()
  public async searchForBuilder(
    @Args('business') business?: string,
    @Args('search') search?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.productsElasticService.searchBuilderProducts(business, search, offset, limit);
  }

  @Query()
  public async getFilter(
    @Args('filter') filter: string,
  ): Promise<any> {
    return this.filterService.getFilter(filter);
  }

  @Query()
  public async getFilterByBusiness(
    @Args('businessId') businessId: string,
  ): Promise<any> {
    return this.productsService.getFilterByBusiness(businessId);
  }

  // tslint:disable-next-line: parameters-max-number
  @Query() public async getProductsByChannelSet(
    @Args('businessId') businessId: string,
    @Args('paginationLimit') paginationLimit: number,
    @Args('existInChannelSet') existInChannelSet: boolean = false,
    @Args({ name: 'orderDirection', type: (): any => SortDirectionEnum }, ParseSortDirPipe)
    orderDirection: SortDirectionEnum,
    @Args('channelSetId') channelSetId?: string,
    @Args('pageNumber') pageNumber?: number,
    @Args('orderBy') orderBy?: string,
    @Args({ name: 'filterById', type: (): any => [String] }) excludeIds?: string[],
    @Args({ name: 'unfilterById', type: (): any => [String] }) includeIds?: string[],
    @Args('search') search?: string,
    @Args({ name: 'filters', type: (): any => [Object] })
    filters?: FilterInterface[],
    @Args('channelSetType') channelSetType?: string,
    @Args('allBusinesses') allBusinesses: boolean = false,
  ): Promise<ProductsPaginatedInterface> {
    const pagination: PaginationDto = {
      limit: paginationLimit,
      page: pageNumber || 1,
    };
    const sort: SortDto = {
      direction: orderDirection,
      field: orderBy,
    };
    const filter: FilterDto = {
      allBusinesses: allBusinesses,
      channelSetId: channelSetId,
      channelSetType: channelSetType,
      excludeIds: excludeIds,
      existInChannelSet: existInChannelSet,
      filters: filters,
      includeIds: includeIds,
      search: search,
    };

    return this.productsService.getProductsByChannelSet(businessId, sort, pagination, filter);
  }

  // tslint:disable-next-line: parameters-max-number
  @Query() public async getProductsByMarketplace(
    @Args('businessUuid') businessId: string,
    @Args('paginationLimit') paginationLimit: number,
    @Args('existInChannelSet') existInChannelSet: boolean = false,
    @Args('existInMarketplace') existInMarketplace: boolean = false,
    @Args({ name: 'orderDirection', type: (): any => SortDirectionEnum }, ParseSortDirPipe)
    orderDirection: SortDirectionEnum,
    @Args('channelSetId') channelSetId?: string,
    @Args('marketplaceId') marketplaceId?: string,
    @Args('pageNumber') pageNumber?: number,
    @Args('orderBy') orderBy?: string,
    @Args({ name: 'filterById', type: (): any => [String] }) excludeIds?: string[],
    @Args({ name: 'unfilterById', type: (): any => [String] }) includeIds?: string[],
    @Args('search') search?: string,
    @Args({ name: 'filters', type: (): any => [Object] })
    filters?: FilterInterface[],
  ): Promise<ProductsPaginatedInterface> {
    const pagination: PaginationDto = {
      limit: paginationLimit,
      page: pageNumber || 1,
    };
    const sort: SortDto = {
      direction: orderDirection,
      field: orderBy,
    };
    const filter: FilterDto = {
      channelSetId: channelSetId,
      excludeIds: excludeIds,
      existInChannelSet: existInChannelSet,
      existInMarketplace: existInMarketplace,
      filters: filters,
      includeIds: includeIds,
      marketplaceId: marketplaceId,
      search: search,
    };

    return this.productsService.getProductsByMarketplace(businessId, sort, pagination, filter);
  }

  @Query()
  public async getProductsByCategories(
    @Args('businessUuid') businessId: string,
    @Args({ name: 'orderDirection', type: (): any => SortDirectionEnum }, ParseSortDirPipe)
    orderDirection: SortDirectionEnum,
    @Args('orderBy') orderBy?: string,
    @Args({ name: 'categories', type: (): any => [String] }) categories?: string[],
    @Args('paginationLimit') paginationLimit?: number,
    @Args('pageNumber') pageNumber?: number,
  ): Promise<ProductsPaginatedInterface> {
    const pagination: PaginationDto = {
      limit: paginationLimit,
      page: pageNumber || 1,
    };

    const sort: SortDto = {
      direction: orderDirection,
      field: orderBy,
    };

    return this.productsService.getProductsByCategory(businessId, categories, pagination, sort);
  }

  @Mutation('createProduct')
  public async createProduct(
    @Args({ name: 'product', type: (): any => ProductDto }, ChannelRulesValidatePipe) product: ProductDto,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<any | Error> {
    if (!product.businessId) {
      product.businessId = product.businessUuid;
    }
    product = plainToClass<ProductDto, any>(ProductDto, product);
    await this.denyAccessUnlessGranted(ProductCreateVoter.CREATE, product, user);

    return this.productsService.createFromDto(product);
  }

  @Mutation('updateProduct')
  public async updateProduct(
    @Args({ name: 'product', type: (): any => ProductDto }) product: ProductDto,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<any | Error> {
    if (!product.businessId) {
      product.businessId = product.businessUuid;
    }

    product = plainToClass<ProductDto, any>(ProductDto, product);
    await this.denyAccessUnlessGranted(ProductUpdateVoter.UPDATE, product, user);

    return this.productsService.updateFromDto(product);
  }

  @Mutation('updateProductChannelSets')
  public async updateProductChannelSets(
    @Args() data: UpdateChannelSetsPayload,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<any> {
    await this.denyAccessUnlessGranted(ProductDeleteVoter.DELETE, data.addToProductIds, user);
    await this.denyAccessUnlessGranted(ProductDeleteVoter.DELETE, data.deleteFromProductIds, user);

    return this.productsService.updateProductsToChannelSet(
      data.business,
      data.channelSets,
      data.addToProductIds,
      data.deleteFromProductIds,
    );
  }

  @Mutation('updateProductsToMarketplaces')
  public async updateProductsToMarketplaces(_: any, data: UpdateMarketplacePayload): Promise<any> {
    return this.productsService.updateProductsToMarketplace(
      data.marketplaces,
      data.addToProductIds,
      data.deleteFromProductIds,
    );
  }

  @Mutation('deleteProduct')
  public async deleteProduct(
    @Args('ids') ids: string[],
    @GqlUser() user: AccessTokenPayload,
  ): Promise<number> {
    await this.denyAccessUnlessGranted(ProductDeleteVoter.DELETE, ids, user);

    return this.productsService.removeProducts(ids);
  }

  @Query('isSkuUsed')
  public async isSkuUsed(
    @Args('sku') sku: string,
    @Args('businessUuid') businessUuid: string,
    @Args('productId') productId: string,
  ): Promise<boolean> {
    return this.productsService.isSkuUsed(sku, businessUuid, productId);
  }


  @Mutation('copyProducts')
  public async copyProducts(
    @Args('businessId') businessId: string,
    @Args('productIds') productIds: string[],
    @Args('targetCollectionId') targetCollectionId?: string,
    @Args('targetFolderId') targetFolderId?: string,
    @Args('prefix') prefix?: string,
  ): Promise<ProductsPaginatedInterface> {
    return  this.productsService.copyProducts(businessId, productIds, targetCollectionId, prefix, targetFolderId);
  }

  private remap(savedProduct: any): any {
    // remap collections for graphql result
    if (savedProduct.collections.length > 0) {
      savedProduct = {
        ...savedProduct.toObject(),
        collections: savedProduct.collections.map((collection: any) => {
          return {
            _id: collection._id,
            description: collection.description,
            name: collection.name,
            slug: collection.slug,
          };
        }),
      };
    }
    if (savedProduct.category) {
      savedProduct.category = {
        id: savedProduct.category.id,
        name: savedProduct.category.name,
        slug: savedProduct.category.slug,
      };
    }

    return savedProduct;
  }
}
