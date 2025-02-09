import { BaseFixture } from '@pe/cucumber-sdk';
import { RuleTypeEnum } from '../../src/social/enums';
import { BUSINESS_ID, FOLDER_ID } from './const';

class FolderFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id: BUSINESS_ID,
      companyAddress: {
        _id: '58a9ff1e-5789-4ca3-b3b1-58142225c7de',
        country: 'AM',
      },
    });

    await this.connection.collection('folders').insertOne({
      "_id": FOLDER_ID,
      "businessId": BUSINESS_ID,
      "name": "Folder 1",
      "parentFolderId": null,
      "scope": "business",
      "applicationId": null,
      "description": "DESC",
      "isHeadline": false,
      "isProtected": false,
      "position": 1,
      "userId": null
    });
  }
}

export = FolderFixture;
