import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { CategoryCreateClass, CategoryUpdateClass, Pagination } from '../classes';
import { CAMPAIGNS_DEFAULT_LIMIT } from '../constants';
import { CategoriesModel, CategoryModel } from '../models';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Business') private businessModel: Model<BusinessModel>,
    @InjectModel('Category') private categoryModel: Model<CategoryModel>,
  ) {
  }

  public async getCategories(
    business: BusinessModel,
    page?: number,
    limit?: number,
  ): Promise<CategoriesModel> {
    const pagination: Pagination = {
      page: page || 1,
      per_page: limit || CAMPAIGNS_DEFAULT_LIMIT,
    };

    const count: number = await this.getCategoriesCount(business);
    const categories: CategoryModel[] = await this.categoryModel.find({ business: business._id })
      .sort({ date: 'desc' })
      .skip((pagination.page - 1) * pagination.per_page)
      .limit(pagination.per_page)
      .exec();

    return {
      categories: categories,
      info: {
        pagination: {
          item_count: count,
          page: pagination.page,
          page_count: Math.ceil(count / pagination.per_page),
          per_page: pagination.per_page,
        },
      },
    } as CategoriesModel;
  }

  public async getCategory(id: string): Promise<CategoryModel> {
    return this.categoryModel.findById(id);
  }

  public async getCategoriesByIds(ids: string[]): Promise<CategoryModel[]> {
    return this.categoryModel.find({
      _id: {
        $in: ids,
      },
    });
  }
  
  public async createCategory(business: BusinessModel, data: CategoryCreateClass): Promise<CategoryModel> {
    return this.categoryModel.create({
      ...data, business: business._id,
    } as any);
  }

  public async updateCategory(id: string, data: CategoryUpdateClass): Promise<CategoryModel> {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteCategories(business: BusinessModel, ids: string[]): Promise<void> {
    await this.categoryModel.remove({ _id: { $in: ids }, business: business.id }).exec();
  }

  private async getCategoriesCount(business: BusinessModel): Promise<number> {
    const filers: any = { business: business._id };

    return this.categoryModel.count(filers).exec();
  }

}
