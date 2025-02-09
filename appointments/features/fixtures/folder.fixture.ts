import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from "@pe/cucumber-sdk";
import { FolderDocument, FolderSchemaName, ScopeEnum } from "@pe/folders-plugin";

class Folder extends BaseFixture {
  protected readonly folderModel: Model<FolderDocument> =
    this.application.get(getModelToken(FolderSchemaName));
  public async apply(): Promise<void> {
    await this.folderModel.create({
      _id: 'folder-1',
      name: 'Folder #1',
      position: 0,
      scope: ScopeEnum.Business,
    })
  }
}

export = Folder;
