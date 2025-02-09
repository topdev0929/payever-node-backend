import { CategoryModel } from '../models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDto, CreateCategoryDto, GetCategoriesListDto, UpdateCategoryDto } from '../dto';
import { Model } from 'mongoose';
import { CategorySchemaName } from '../schemas';
import { SlugHelper } from '../helpers';
import { CategoryConverter } from '../converters';
import { QueryBuilder } from '../../common/helpers';
import { CategoryEventsEnum, CategoryFilterFieldsMapping } from '../enums';
import { PaginationDto, SortDto } from '../../products/dto';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(CategorySchemaName) private readonly categoryModel: Model<CategoryModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async getByIdAndBusiness(id: string, businessId: string): Promise<CategoryModel> {
    return this.categoryModel.findOne({
      _id: id,
      businessId,
    });
  }

  public async getByName(
    name: string,
    businessId: string,
    parent: CategoryModel = null,
  ): Promise<CategoryModel> {
    return this.categoryModel.findOne({
      businessId,
      name,
      parent,
    });
  }

  public async getBySlug(slug: string, businessId: string, parent: CategoryModel): Promise<CategoryModel> {
    return this.categoryModel.findOne({
      businessId,
      parent,
      slug,
    });
  }

  public async getById(id: string): Promise<CategoryModel> {
    return this.categoryModel.findOne({ _id: id });
  }

  public async create(createCategoryDto: CreateCategoryDto, businessId: string): Promise<CategoryModel> {
    if (!createCategoryDto.slug) {
      createCategoryDto.slug = SlugHelper.getSlug(createCategoryDto.name);
    }

    let parentCategory: CategoryModel;
    if (createCategoryDto.parent) {
      parentCategory = await this.getById(createCategoryDto.parent);
    }

    const category: CategoryModel = await this.categoryModel.create({
      ...createCategoryDto,
      ancestors: parentCategory ? await this.buildAncestors(parentCategory) : [],
      businessId,
    } as any);

    await this.eventDispatcher.dispatch(CategoryEventsEnum.CategoryCreated, category);

    return category;
  }

  public async update(category: CategoryModel, updateCategoryDto: UpdateCategoryDto): Promise<CategoryModel> {
    if (!updateCategoryDto.slug) {
      updateCategoryDto.slug = SlugHelper.getSlug(updateCategoryDto.name);
    }

    const parent: CategoryModel = updateCategoryDto.parent
      ? await this.getById(updateCategoryDto.parent)
      : undefined;

    const result: CategoryModel = await this.categoryModel.findOneAndUpdate(
      { _id: category.id },
      {
        $set: {
          attributes: updateCategoryDto.attributes || undefined,
          description: updateCategoryDto.description || undefined,
          image: updateCategoryDto.image || undefined,
          name: updateCategoryDto.name || undefined,
          parent,
          slug: updateCategoryDto.slug || undefined,
        },
      },
      { new: true },
    );

    await this.eventDispatcher.dispatch(CategoryEventsEnum.CategoryUpdated, result);

    return result;
  }

  public async delete(category: CategoryModel): Promise<void> {
    const data: CategoryModel = await this.categoryModel.findOneAndDelete({ _id: category.id });
    await this.eventDispatcher.dispatch(CategoryEventsEnum.CategoryRemoved, data);
  }

  public async getList(getListDto: GetCategoriesListDto): Promise<CategoryModel[]> {
    const query: any = {
      businessId: getListDto.businessId,
    };
    if (getListDto.name) {
      query.name = new RegExp(getListDto.name);
    }

    return this.categoryModel.find(query);
  }

  public async findOrCreateByNameAndBusiness(
    name: string,
    businessId: string,
    parent: CategoryModel = null,
  ): Promise<CategoryModel> {
    let category: CategoryModel = await this.categoryModel.findOne(
      {
        $or : [
          { name, businessId },
          { slug: SlugHelper.getSlug(name), businessId },
        ],
      },
    );
    if (!category) {
      category = await this.create(
        {
          attributes: [],
          businessId,
          name,
          parent: parent ? parent.id : undefined,
          slug: SlugHelper.getSlug(name),
        },
        businessId,
      );
    }

    return category;
  }

  public async getWithInheritedAttributes(categoryId: string): Promise<CategoryDto> {
    return CategoryConverter.toCategoryWithInheritedAttributes(
      await this.categoryModel.findOne({ _id: categoryId}).populate('parent').populate('ancestors'),
    );
  }

  public async getBuilderCategories(
    businessId: string,
    filter: any,
    order: any,
    offset: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const queryBuilder: any = new QueryBuilder(CategoryFilterFieldsMapping);
    let filterData: any = filter ? filter : [ ];
    filterData = typeof filter === 'string' && filter !== '' ? JSON.parse(filter) : [ ];

    const query: any = {
      businessId,
      ...queryBuilder.buildQuery(filterData),
    };

    const orderBy: { [propName: string]: 1 | -1 } = { };
    if (order) {
      let orderData: any = order ? order : [ ];
      orderData = (typeof order === 'string' && order !== '') ? JSON.parse(order) : [ ];
      for (const data of orderData) {
        orderBy[data.field] = data.direction === 'asc' ? 1 : -1;
      }
    }

    return this.fetchCategoriesForBuilder(query, orderBy, limit, offset);
  }

  public async getByQuery(
    query: object,
    pagination: PaginationDto = { page: 1, limit: 0 },
    sort: SortDto,
  ): Promise<CategoryModel[]> {
    const { page, limit }: { page: number; limit: number } = pagination;
    const skip: number = (page - 1) * limit;

    const listPromise: any = this.categoryModel
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

  public async fetchCategoriesForBuilder(
    query: any,
    orderBy: any,
    limit: number,
    skip: number,
  ): Promise<any> {
    const docs: CategoryModel[] = await this.categoryModel
      .find(query)
      .sort(orderBy)
      .limit(limit)
      .skip(skip)
      .populate('ancestors parent');

    const data: any = docs.map((x: any) => x.toObject());

    const count: number = await this.categoryModel
      .count(query);

    return {
      result: data,
      totalCount: count,
    };
  }

  private async buildAncestors(parentCategory: CategoryModel): Promise<string[]> {
    await parentCategory.populate('ancestors').execPopulate();
    const ancestors: string[] = parentCategory.ancestors
      ? parentCategory.ancestors.map((ancestor: CategoryModel) => ancestor.id)
      : [];

    ancestors.push(parentCategory.id);

    return ancestors;
  }
}
