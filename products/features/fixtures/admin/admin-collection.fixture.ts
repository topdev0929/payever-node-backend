import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { CollectionModel } from '../../../src/categories/models';



const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
const COLLECTION_ID_1: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp1';
const COLLECTION_ID_2: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp2';

class AdminCollectionFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly collectionModel: Model<CollectionModel> = this.application.get('CollectionModel');

  public async apply(): Promise<void> {

    const companyDetail: any = { companyAddress: { }, companyDetails: { }, contactDetails: { } };
    await this.businessModel.create({ ...companyDetail, _id: BUSINESS_ID_1, name: 'Test Company 1' });
    await this.businessModel.create({ ...companyDetail, _id: BUSINESS_ID_2, name: 'Test Company 2' });

    const collectionTemplate: any = {
      'activeSince': '2020-06-09T11:00:35.316Z',
      'ancestors': [],
      'automaticFillConditions': {
        '_id': '6283615ca13eadfc096418d9',
        'filters': [],
        'manualProductsList': [],
        'strict': false,
      },
      'channelSets': [],
      'description': 'test ahahah',
      'image': '359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg',
      'name': 'Collections test',
      'slug': 'Collections_test',
    };

    await this.collectionModel.create({
      ...collectionTemplate,
      _id: COLLECTION_ID_1,
      'businessId': BUSINESS_ID_1,
    });

    await this.collectionModel.create({
      ...collectionTemplate,
      _id: COLLECTION_ID_2,
      'businessId': BUSINESS_ID_2,
    });


  }
}

export = AdminCollectionFixture;
