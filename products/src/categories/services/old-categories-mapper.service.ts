import { Injectable } from '@nestjs/common';

import { CategoryModel } from '../models';
import { ProductCategoryDto } from '../../products/dto';
import { CategoryService } from './category.service';

@Injectable()
export class OldCategoriesMapperService {

  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  public async findOrCreateCategory(categories: ProductCategoryDto[], businessId: string): Promise<CategoryModel[]> {

    if (!categories || !categories.length) {
      return null;
    }

    const newCategories: CategoryModel[] = [];

    for (const category of categories) {
      const newCategory: CategoryModel
        = await this.categoryService.findOrCreateByNameAndBusiness(category.title, businessId);
      newCategories.push(newCategory);
    }

    return newCategories;
  }

  public async  findOrCreateSubcategory(
    category: CategoryModel,
    categories: ProductCategoryDto[],
  ): Promise<CategoryModel> {

    if (!category || !categories || categories.length < 2) {
      return null;
    }

    const subscategoryName: string = categories[1].title;

    if (!subscategoryName) {
      return null;
    }

    return this.categoryService.findOrCreateByNameAndBusiness(
      subscategoryName,
      category.businessId,
      category,
    );
  }
}
