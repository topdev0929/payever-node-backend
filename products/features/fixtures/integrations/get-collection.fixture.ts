import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../src/products/models';
import { businessFactory, productFactory } from '../factories';
import { BusinessModel, BusinessSchemaName } from '../../../src/business';
import { CategorySchemaName, CollectionSchemaName } from "../../../src/categories/schemas";
import { CategoryModel, CollectionModel } from "../../../src/categories/models";

const BUSINESS_ID_1: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const BUSINESS_ID_2: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

class GetCollection extends BaseFixture {
  private readonly collectionModel: Model<CollectionModel> = this.application.get(getModelToken(CollectionSchemaName));

  public async apply(): Promise<void> {
    await this.collectionModel.create(
        {
            "_id": "36fee3b0-917a-40af-bcae-9dfb699369bd",
            "channelSets": [],
            "ancestors": [],
            "automaticFillConditions": {
                "strict": false,
                "manualProductsList": [],
                "filters": []
            },
            "description": "All",
            "name": "All",
            "parent": null,
            "slug": "All",
            "businessId": BUSINESS_ID_1,
        }
    );
  }
}

export = GetCollection;
