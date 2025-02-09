import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DefaultCategorySchemaName } from '../schemas';
import { DefaultCategoryModel } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class DefaultCategoriesService {
  constructor(
    @InjectModel(DefaultCategorySchemaName) private readonly defaultCategoryModel: Model<DefaultCategoryModel>,
  ) { }

  public async getByPath(path: string): Promise<DefaultCategoryModel> {
    return this.defaultCategoryModel.findOne({ path });
  }
}
