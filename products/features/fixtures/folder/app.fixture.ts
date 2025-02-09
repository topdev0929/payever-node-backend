import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { FolderSchemaName, ScopeEnum } from '@pe/folders-plugin';
import { Model } from 'mongoose';
import { BusinessSchemaName } from '../../../src/business';
import { businessFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'c83e2697-65ab-4955-ba60-39ee607086d5';
const FOLDER_ID: string = 'ffffffff-ffff-ffff-ffff-fffffffffff1';
const DEFAULT_FOLDER: string = 'ffffffff-ffff-ffff-ffff-fffffffffff0';

class AppProductsListFixture extends BaseFixture {
  private businessModel: Model<any> = this.application.get(getModelToken(BusinessSchemaName));
  private folderModel: Model<any> = this.application.get(getModelToken(FolderSchemaName));

  public async apply(): Promise<void> {

    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
      name: 'Test business',
    }));

    await this.businessModel.create(businessFactory({
      _id: ANOTHER_BUSINESS_ID,
      name: 'Another business',
    }));

    await this.folderModel.create(
      {
        _id: FOLDER_ID,
        businessId: BUSINESS_ID,
        isFolder: true,
        isHeadline: false,
        isProtected: false,
        name: 'base 1',
        parentFolderId: null,
        position: 0,
        scope: ScopeEnum.Business,
      },
    );

    await this.folderModel.create(
      {
        _id: DEFAULT_FOLDER,
        businessId: null,
        isFolder: true,
        isHeadline: false,
        isProtected: true,
        name: 'All',
        parentFolderId: null,
        position: 1,
        scope: ScopeEnum.Default,
      },
    );
  }
}

export = AppProductsListFixture;
