import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { EntityTypeEnum } from '../../src/media/enums';
import { MediaItemModel, MediaItemRelationModel, UserModel } from '../../src/media/models';
import { USER_1_ID, USER_1_MEDIA_ITEM_1_ID } from './const';

class UsersFixture extends BaseFixture {
  private readonly userModel: Model<UserModel> = this.application.get('UserModel');
  private readonly mediaItemModel: Model<MediaItemModel> = this.application.get('MediaItemModel');
  private readonly mediItemRelation: Model<MediaItemRelationModel> = this.application.get('MediaItemRelationModel');

  public async apply(): Promise<void> {
    await this.userModel.create({
      _id: USER_1_ID,
    });

    await this.mediaItemModel.create({
      _id: USER_1_MEDIA_ITEM_1_ID,
      container: 'shop',
      name: 'mediaItemName',
    });

    await this.mediItemRelation.create({
      _id: 'media-item-relation',
      entityId: USER_1_ID,
      entityType: EntityTypeEnum.user,
      mediaItem: USER_1_MEDIA_ITEM_1_ID,
    });
  }
}

export = UsersFixture;
