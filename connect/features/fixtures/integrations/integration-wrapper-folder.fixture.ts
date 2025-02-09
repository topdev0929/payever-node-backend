// tslint:disable: object-literal-sort-keys
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { FolderDocument, ScopeEnum, FolderSchemaName } from '@pe/folders-plugin';
import { ID_OF_FOLDER_1, ID_OF_ROOT_FOLDER_1 } from '../const';

class IntegrationWrapperFolderFixture extends BaseFixture {
  protected readonly folderModel: Model<FolderDocument> = this.application.get(getModelToken(FolderSchemaName));
  public async apply(): Promise<void> {
    await this.folderModel.create({
      _id: ID_OF_ROOT_FOLDER_1,
      businessId: null,
      image: '',
      name: '/',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: null,
      isHeadline: false,
      isProtected: false,
    });
    await this.folderModel.create({
      _id: ID_OF_FOLDER_1,
      businessId: null,
      image: 'payments-icon-filter.svg',
      name: 'integrations.categories.payments',
      position: 1,
      scope: ScopeEnum.Default,
      parentFolderId: ID_OF_ROOT_FOLDER_1,
      isHeadline: false,
      isProtected: false,
    });
  }
}

export = IntegrationWrapperFolderFixture;
