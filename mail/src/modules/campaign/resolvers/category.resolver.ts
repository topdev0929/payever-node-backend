import { Logger, UseGuards } from '@nestjs/common';
import { Acl, AclActionsEnum, MessageBusService, Roles, RolesEnum } from '@pe/nest-kit';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomError, ErrorName } from '../../../common';
import { BusinessModel, BusinessService } from '../../business';
import { CategoryCreateClass, CategoryUpdateClass } from '../classes';
import { CategoriesModel, CategoryModel } from '../models';
import { CategoryService } from '../services';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';

@UseGuards(GqlAuthGuard)
@Resolver('Category')
@Roles(RolesEnum.merchant)
export class CategoryResolver extends AbstractGqlResolver {
  constructor(
    private readonly messageBusService: MessageBusService,
    private readonly logger: Logger,
    private readonly categoryService: CategoryService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read })
  public async getCategories(
    @Args('businessId') businessId: string,
    @Args('page') page?: number,
    @Args('limit') limit?: number,
  ): Promise<CategoriesModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);

    return this.categoryService.getCategories(business, page, limit);
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read })
  public async getCategory(
    @Args('businessId') businessId: string,
    @Args('id') categoryId: string,
  ): Promise<CategoryModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);

    const category: CategoryModel = await this.categoryService.getCategory(categoryId);
    this.checkIfCategoryInBusiness(business, category);

    return category;
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.create })
  public async createCategory(
    @Args('businessId') businessId: string,
    @Args('data') data: CategoryCreateClass,
  ): Promise<CategoryModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);

    return this.categoryService.createCategory(business, data);
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.update })
  public async updateCategory(
    @Args('businessId') businessId: string,
    @Args('id') categoryId: string,
    @Args('data') data: CategoryUpdateClass,
  ): Promise<CategoryModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);

    const category: CategoryModel = await this.categoryService.getCategory(categoryId);
    this.checkIfCategoryInBusiness(business, category);

    return this.categoryService.updateCategory(category.id, data);
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.delete })
  public async deleteCategories(
    @Args('businessId') businessId: string,
    @Args('ids') ids: string[],
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);
    if (!ids || !Array.isArray(ids)) {
      throw new CustomError(ErrorName.IdsNotValid);
    }
    const categories: CategoryModel[] = await this.categoryService.getCategoriesByIds(ids);
    for (const category of categories) {
      this.checkIfCategoryInBusiness(business, category);
    }
    await this.categoryService.deleteCategories(business, ids);
  }

  private checkIfCategoryInBusiness(business: BusinessModel, category: CategoryModel): void {
    if (category.business !== business.id) {
      throw new CustomError(
        ErrorName.ItemNotInBusiness, {
          businessId: business.id, itemId: category.id, itemName: 'category',
        },
      );
    }
  }

  private isBusinessExist(business: BusinessModel): void {
    if (!business) {
      throw new CustomError(ErrorName.IdsNotValid);
    }
  }
}
