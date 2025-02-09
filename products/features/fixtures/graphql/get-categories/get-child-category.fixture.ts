import { getModelToken } from '@nestjs/mongoose';
import { categoryFactory } from '../../factories';
import { CategoryModel } from '../../../../src/categories/models';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { CategorySchemaName } from '../../../../src/categories/schemas';
import { AttributeTypesEnum } from '../../../../src/categories/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CATEGORY_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const ROOT_CATEGORY_ID: string = '00000000-0000-0000-0000-000000000000';
const FIRST_LEVEL_CATEGORY_ID: string = '11111111-1111-1111-1111-111111111111';
const SECOND_LEVEL_CATEGORY_ID: string = '22222222-2222-2222-2222-222222222222';

class GetRootCategoryFixture extends BaseFixture {
  private readonly categoryModel: Model<CategoryModel> = this.application.get(getModelToken(CategorySchemaName));

  public async apply(): Promise<void> {
    await this.categoryModel.create(categoryFactory({
      _id: ROOT_CATEGORY_ID,
      attributes: [
        {
          name: 'Root Option',
          type: AttributeTypesEnum.text,
        },
      ],
      businessId: BUSINESS_ID,
      name: `Root`,
      slug: `root`,
    }));

    await this.categoryModel.create(categoryFactory({
      _id: FIRST_LEVEL_CATEGORY_ID,
      ancestors: [ROOT_CATEGORY_ID],
      businessId: BUSINESS_ID,
      name: `First level`,
      parent: ROOT_CATEGORY_ID,
      slug: `first-level`,
    }));

    await this.categoryModel.create(categoryFactory({
      _id: SECOND_LEVEL_CATEGORY_ID,
      ancestors: [ROOT_CATEGORY_ID, FIRST_LEVEL_CATEGORY_ID],
      attributes: [
        {
          name: 'Second Level Option 1',
          type: AttributeTypesEnum.text,
        },
        {
          name: 'Second Level Option 2',
          type: AttributeTypesEnum.text,
        },
      ],
      businessId: BUSINESS_ID,
      name: `Second level`,
      parent: FIRST_LEVEL_CATEGORY_ID,
      slug: `second-level`,
    }));

    await this.categoryModel.create(categoryFactory({
      _id: CATEGORY_ID,
      ancestors: [ROOT_CATEGORY_ID, FIRST_LEVEL_CATEGORY_ID, SECOND_LEVEL_CATEGORY_ID],
      attributes: [
        {
          name: 'Category Option',
          type: AttributeTypesEnum.text,
        },
      ],
      businessId: BUSINESS_ID,
      name: `Category`,
      parent: SECOND_LEVEL_CATEGORY_ID,
      slug: `category`,
    }));
  }
}

export = GetRootCategoryFixture;
