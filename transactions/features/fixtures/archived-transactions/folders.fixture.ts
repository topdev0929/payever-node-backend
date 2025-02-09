import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { FolderDocumentModel, FolderSchemaName, ScopeEnum } from '@pe/folders-plugin';

const rootFolderId: string = '79b8cba1-76e9-43d7-964e-399ac6ae6bde';
const archiveFolderId: string = '9d10611a-f4f7-497d-a677-96812183f942';

class FolderFixture extends BaseFixture {

  private readonly folderModel: Model<FolderDocumentModel> =
    this.application.get(getModelToken(FolderSchemaName));

  public async apply(): Promise<void> {
    await this.folderModel.create({
      _id: rootFolderId,
      position: 0,
      name: '/',
      title: '/',
      scope: ScopeEnum.Business,
    });

    await this.folderModel.create({
      _id: archiveFolderId,
      position: 1,
      name: 'Archive',
      title: 'Archive',
      scope: ScopeEnum.Default,
    });
  }
}

export = FolderFixture;
