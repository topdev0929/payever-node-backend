// DEPRECATED: use the one on categories module

import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ProductCategoryModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto, ProductCategoryDto } from '../dto';
import { ProductCategoryInterface } from '../interfaces';
import { CategoryInterface } from '../../categories/interfaces';

const DEFAULT_CATEGORIES: string[] = [
  'Arts & Crafts',
  'Baby',
  'Beauty & Personal Care',
  'Books',
  'Computers',
  'Electronics',
  'Fashion',
  'Health & Household',
  'Home & Kitchen',
  'Luggage',
  'Movies & TV',
  'Music, CDs & Vinyl',
  'Pet Supplies',
  'Sports & Outdoors',
  'Tools & Home Improvement',
  'Toys & Games',
  'Video Games',
];

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectModel('Category') private readonly productCategoryModel: Model<ProductCategoryModel>,
  ) { }

  public async getCategories(
    businessId: string,
    filter: string = '',
    pagination: PaginationDto = { limit: 0, page: 1 },
  ): Promise<ProductCategoryDto[]> {
    const { page, limit }: { page: number; limit: number } = pagination;
    const skip: number = (page - 1) * limit;

    const docs: any = await this.productCategoryModel
      .find({
        businessId: businessId,
        name: {
          $options: 'i',
          $regex: `(.+)?${filter}(.+)?`,
        },
      })
      .limit(limit)
      .skip(skip);

    return docs.map((x: any) => x.toObject());
  }

  public async createCategory(businessId: string, title: string): Promise<ProductCategoryModel> {
    try {
      return await this.productCategoryModel.findOneAndUpdate(
        {
          businessId: businessId,
          name: title,
        },
        {
          businessId: businessId,
          name: title,
          slug: this.slug(title),
        },
        {
          new: true,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        return this.createCategory(businessId, title);
      }

      throw e;
    }
  }

  public async findCategory(businessId: string, title: string): Promise<ProductCategoryModel> {
    return this.productCategoryModel
      .findOne({
        businessId: businessId,
        slug: this.slug(title),
      })
      .exec();
  }

  public async createDefaultCategories(businessId: string): Promise<ProductCategoryModel[]> {
    const categoryObjects: CategoryInterface[] = DEFAULT_CATEGORIES.map((category: string) => {
      return {
        businessId: businessId,
        name: category,
        slug: this.slug(category),
      };
    });

    return this.productCategoryModel.create(categoryObjects as ProductCategoryModel[]);
  }

  public async removeByBusinessId(businessId: string): Promise<void> {
    await this.productCategoryModel.deleteMany({ businessId: businessId });
  }

  private slug(title: string): string {
    return encodeURIComponent(
      title
        .trim()
        .split(' ')
        .join('_'),
    );
  }
}
