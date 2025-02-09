import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { CategoryModel, CategorySchemaName } from '../../../src/integration';

const CATEGORY_ID_1: string = '11111111-1111-1111-1111-111111111111';
const CATEGORY_ID_2: string = '22222222-2222-2222-2222-222222222222';

class AdminCategoryCreateFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly categoryModel: Model<CategoryModel> = this.application.get(getModelToken(CategorySchemaName));

  public async apply(): Promise<void> {

    await this.categoryModel.create(
      {
        _id: CATEGORY_ID_1,
        name: "category 1",
        icon: "icon 1"
      });

    await this.categoryModel.create(
      {
        _id: CATEGORY_ID_2,
        name: "category 2",
        icon: "icon 2"
      });
  }
}

export = AdminCategoryCreateFixture;
