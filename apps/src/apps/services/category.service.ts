import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryModel } from '../models';
import { CategorySchemaName } from '../schemas';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategorySchemaName)
    private readonly categoryModel: Model<CategoryModel>,
  ) { }

  public async findOneByName(name: string): Promise<CategoryModel> {
    return this.categoryModel.findOne({ name });
  }
}
