import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { classToPlain } from 'class-transformer';

import { CategoryModel } from '../models/category.model';
import { CategorySchemaName } from '../schemas/category.schema';
import { CategoryInterface } from '../interfaces/entities';
import { CategoryDto } from '../dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategorySchemaName) private readonly categoryModel: Model<CategoryModel>,
  ) { }

  public async read(filter: FilterQuery<CategoryModel>): Promise<CategoryModel[]> {
    return this.categoryModel.find(filter);
  }

  public async createOrUpdate(dto: CategoryDto): Promise<CategoryModel> {
    const plain: CategoryInterface = classToPlain(dto) as CategoryInterface;

    return this.categoryModel.findOneAndUpdate({
      _id: dto._id,
    }, plain, {
      new: true,
      upsert: true,
    });
  }
}
