import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';
import { AccessTokenPayload, Roles, RolesEnum } from '@pe/nest-kit';
import { GqlUser } from '@pe/nest-kit/modules/auth/decorators/gql-user.decorator';
import { ServiceExceptionFilter } from '../../../products/graphql/resolvers/service.exception.filter';
import {
  CategoryElasticService,
  CategoryService,
  CollectionElasticService,
  CollectionsService,
  FilterService,
} from '../../services';
import { CategoryDto, CreateCategoryDto, GetCategoriesListDto, UpdateCategoryDto } from '../../dto';
import { CategoryModel } from '../../models';
import { CategoryCreateVoter, CategoryUpdateVoter } from '../../voters';
import { CategoryConverter } from '../../converters';

@Resolver()
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.anonymous)
export class CategoriesResolver extends AbstractGqlResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly collectionsService: CollectionsService,
    private readonly filterService: FilterService,
    private readonly categoryElasticService: CategoryElasticService,
    private readonly collectionElasticService: CollectionElasticService,
  ) {
    super();
  }

  @Query() public async getCategory(
    @Args('categoryId') categoryId: string,
  ): Promise<CategoryDto> {
    return this.categoryService.getWithInheritedAttributes(categoryId);
  }

  @Query() public async listCategories(
    @Args({ name: 'dto', type: (): any => GetCategoriesListDto }) dto: GetCategoriesListDto,
  ): Promise<CategoryModel[]> {
    return this.categoryService.getList(dto);
  }

  @Mutation('createCategory')
  public async createCategory(
    @Args({ name: 'dto', type: (): any => CreateCategoryDto }) createCategoryDto: CreateCategoryDto,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<CategoryDto | Error> {
    await this.denyAccessUnlessGranted(CategoryCreateVoter.CREATE, createCategoryDto, user);

    const category: CategoryModel = await this.categoryService.create(createCategoryDto, createCategoryDto.businessId);
    await category.populate('parent').populate('ancestors').execPopulate();

    return CategoryConverter.toCategoryWithInheritedAttributes(category);
  }

  @Mutation('updateCategory')
  public async updateCategory(
    @Args('categoryId') categoryId: string,
    @Args({ name: 'dto', type: (): any => UpdateCategoryDto }) updateCategoryDto: UpdateCategoryDto,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<CategoryDto | Error> {
    const originalCategory: CategoryModel = await this.fetchCategory(categoryId);

    await this.denyAccessUnlessGranted(CategoryUpdateVoter.UPDATE, originalCategory, user);
    await this.denyAccessUnlessGranted(CategoryUpdateVoter.UPDATE, updateCategoryDto, user);

    const category: CategoryModel = await this.categoryService.update(originalCategory, updateCategoryDto);
    await category.populate('parent').populate('ancestors').execPopulate();

    return CategoryConverter.toCategoryWithInheritedAttributes(category);
  }

  @Mutation('deleteCategory')
  public async deleteCategory(
    @Args('categoryId') categoryId: string,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<boolean> {
    const category: CategoryModel = await this.fetchCategory(categoryId);
    await this.denyAccessUnlessGranted(CategoryUpdateVoter.UPDATE, category, user);

    await this.categoryService.delete(category);

    return true;
  }

  @Query()
  public async getCategoriesForBuilder(
    @Args('filter') filter: string,
    @Args('business') business?: string,
    @Args('order') order?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.categoryService.getBuilderCategories(business, filter, order, offset, limit);
  }

  @Query()
  public async getFilter(
    @Args('filter') filter: string,
  ): Promise<any> {
    return this.filterService.getFilter(filter);
  }

  @Query()
  public async getCollectionForBuilder(
    @Args('filter') filter: string,
    @Args('business') business?: string,
    @Args('order') order?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.collectionsService.getBuilderCollection(business, filter, order, offset, limit);
  }

  @Query()
  public async searchCategoriesForBuilder(
    @Args('business') business?: string,
    @Args('search') search?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.categoryElasticService.searchBuilderCategories(business, search, offset, limit);
  }

  @Query()
  public async searchCollectionForBuilder(
    @Args('business') business?: string,
    @Args('search') search?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.collectionElasticService.searchBuilderCollections(business, search, offset, limit);
  }

  private async fetchCategory(categoryId: string): Promise<CategoryModel> {
    const category: CategoryModel = await this.categoryService.getById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category "${categoryId}" not found`);
    }

    return category;
  }
}
