import { getModelToken } from '@nestjs/mongoose';
import { categoryFactory } from '../../factories';
import { CategoryModel } from '../../../../src/categories/models';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { CategorySchemaName } from '../../../../src/categories/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ROOT_CATEGORY_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class GetRootCategoryFixture extends BaseFixture {
  private readonly categoryModel: Model<CategoryModel> = this.application.get(getModelToken(CategorySchemaName));

  public async apply(): Promise<void> {
    await this.categoryModel.create(categoryFactory({
      _id: ROOT_CATEGORY_ID,
      businessId: BUSINESS_ID,
      name: `Category 1`,
      slug: `category_1`,
    }));
  }
}

export = GetRootCategoryFixture;
