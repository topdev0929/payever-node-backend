import { ProductModel, ProductCategoryModel } from '../../../../src/products/models';
import { CollectionModel } from '../../../../src/categories/models';
import { productFactory } from '../../factories';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { FolderDocument as FolderModel, ScopeEnum } from '@pe/folders-plugin';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

class GetRecommendationsFixture extends BaseFixture {
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');
  private readonly productCategoriesModel: Model<ProductCategoryModel> = this.application.get('CategoryModel');
  private readonly collectionModel: Model<CollectionModel> = this.application.get('CollectionModel');
  private readonly foldersModel: Model<FolderModel> = this.application.get('FolderModel');

  public async apply(): Promise<void> {
    await this.productCategoriesModel.create({
      _id: '5fcf3218c4597aa78cbf2d95',
      businessId: someBusinessId,
      name : 'Baby',
      slug : 'baby',
    });
    await this.collectionModel.create({
        _id: '5fcf3218c4597aa78cbf2d96',
        businessId: someBusinessId,
        channelSets : [],
        description: '179080',
        name: 'Collections_163',
        slug : 'Collections_163',
      });

    await this.productModel.create(productFactory({
      _id: 'a482bf57-1aec-4304-8751-4ce5cea603a1',
      businessId: someBusinessId,
      categories: [
        {
          _id: '_id',
          businessId: someBusinessId,
          slug: 'slug',
          title: 'supplement',
        },
      ],
      channelSets: ['11111111-1111-1111-1111-111111111111'],
      price: 3,
      title: 'Salt',
      uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    }));

    await this.productModel.create(productFactory({
      _id: 'a482bf57-1aec-4304-8751-4ce5cea603a2',
      businessId: someBusinessId,
      categories: [
        {
          _id: '_id',
          businessId: someBusinessId,
          slug: 'slug',
          title: 'supplement',
        },
      ],
      price: 5,
      title: 'Pepper',
      uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
    }));

    const parentId: string = 'e563339f-0b4c-4aef-92e7-203b9761981c';
    await this.productModel.create(productFactory({
      _id: 'a482bf57-1aec-4304-8751-4ce5cea603a3',
      businessId: someBusinessId,
      categories: [
        {
          _id: '_id',
          businessId: someBusinessId,
          slug: 'slug',
          title: 'food',
        },
      ],
      price: 4,
      title: 'Sugar',
      uuid: parentId,
    }));

    await this.foldersModel.create([
      {
        _id: '8869db5c-6f67-4aaf-8f6a-d5c0ca92c286',
        businessId: someBusinessId,
        name: '/',
        parentFolderId: null,
        position: 1,
        scope: ScopeEnum.Business,
      }, {
        _id: 'cc5701a5-6927-4202-866f-123aa6414c9d',
        businessId: someBusinessId,
        name: 'Folder 1',
        parentFolderId: '8869db5c-6f67-4aaf-8f6a-d5c0ca92c286',
        position: 1,
        scope: ScopeEnum.Business,
      },
    ]);
  }
}

export = GetRecommendationsFixture;
