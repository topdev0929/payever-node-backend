import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { FolderDocument, ScopeEnum } from '@pe/folders-plugin';
import { ID_OF_BUSINESS_2, ID_OF_BUSINESS_3, ID_OF_EXISTING_BUSINESS, ID_OF_FOLDER_1, ID_OF_FOLDER_2, ID_OF_FOLDER_3, ID_OF_FOLDER_4, ID_OF_FOLDER_5, ID_OF_FOLDER_6, ID_OF_FOLDER_7, ID_OF_ROOT_FOLDER_1, ID_OF_ROOT_FOLDER_2, ID_OF_ROOT_FOLDER_3, ID_OF_ROOT_FOLDER_FOR_USER_7, ID_OF_USER_7 } from './const';

class FoldersFixture extends BaseFixture {
  protected readonly folderModel: Model<FolderDocument> = this.application.get('FolderModel');
  public async apply(): Promise<void> {

    // Folder for business 2
    await this.folderModel.create({
      _id: ID_OF_ROOT_FOLDER_1,
      businessId: ID_OF_EXISTING_BUSINESS,
      image: '',
      name: '/',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: null,
    })
    await this.folderModel.create({
      _id: ID_OF_FOLDER_1,
      businessId: ID_OF_EXISTING_BUSINESS,
      image: 'whatsapp.png',
      name: 'Whatsapp',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: ID_OF_ROOT_FOLDER_1,
    });
    await this.folderModel.create({
      _id: ID_OF_FOLDER_2,
      businessId: ID_OF_EXISTING_BUSINESS,
      image: 'whatsapp.png',
      name: 'Livechat',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: ID_OF_ROOT_FOLDER_1,
    });


    // Folder for business 2
    await this.folderModel.create({
      _id: ID_OF_ROOT_FOLDER_2,
      businessId: ID_OF_BUSINESS_2,
      image: '',
      name: '/',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: null,
    })
    await this.folderModel.create({
      _id: ID_OF_FOLDER_3,
      businessId: ID_OF_BUSINESS_2,
      image: 'whatsapp.png',
      name: 'business2-facebook',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: ID_OF_ROOT_FOLDER_2,
    });
    await this.folderModel.create({
      _id: ID_OF_FOLDER_4,
      businessId: ID_OF_BUSINESS_2,
      image: 'whatsapp.png',
      name: 'business2-livechat',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: ID_OF_ROOT_FOLDER_2,
    });


    // Folder for business 3
    await this.folderModel.create({
      _id: ID_OF_ROOT_FOLDER_3,
      businessId: ID_OF_BUSINESS_3,
      image: '',
      name: '/',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: null,
    })
    await this.folderModel.create({
      _id: ID_OF_FOLDER_5,
      businessId: ID_OF_BUSINESS_3,
      image: 'whatsapp.png',
      name: 'business3-facebook',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: ID_OF_ROOT_FOLDER_3,
    });
    await this.folderModel.create({
      _id: ID_OF_FOLDER_6,
      businessId: ID_OF_BUSINESS_3,
      image: 'whatsapp.png',
      name: 'business3-livechat',
      position: 0,
      scope: ScopeEnum.Business,
      parentFolderId: ID_OF_ROOT_FOLDER_3,
    });
    

    // Folder for profile
    await this.folderModel.create({
      _id: ID_OF_ROOT_FOLDER_FOR_USER_7,
      businessId: null,
      image: '',
      name: '/',
      position: 0,
      scope: ScopeEnum.User,
      parentFolderId: null,
      userId: ID_OF_USER_7,
      description:'Root folder for user 7'
    })
    await this.folderModel.create({
      _id: ID_OF_FOLDER_7,
      businessId: null,
      image: 'facebook.png',
      name: 'my folder',
      position: 0,
      scope: ScopeEnum.User,
      parentFolderId: ID_OF_ROOT_FOLDER_FOR_USER_7,
      userId: ID_OF_USER_7,
    });
  }
}

export = FoldersFixture;
