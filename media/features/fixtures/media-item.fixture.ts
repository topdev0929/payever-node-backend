import { BaseFixture } from '@pe/cucumber-sdk/module';
import { MediaContainersEnum } from '@pe/media-sdk';
import { Model } from 'mongoose';

import { MediaItemModel } from '../../src/media/models/media-item.model';

class MediaItemFixture extends BaseFixture {
  private readonly mediaItemModel: Model<MediaItemModel> = this.application.get('MediaItemModel');

  public async apply(): Promise<void> {
    await this.mediaItemModel.create({
      _id: '10ff2c21-fb3c-420a-a331-e5d51e511fa1',
      applicationId: 'a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1',
      container: MediaContainersEnum.Message,
      name: 'mediaItemName',
    });

    await this.mediaItemModel.create({
      _id: '10ff2c21-fb3c-420a-a331-e5d51e511fa2',
      applicationId: 'a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1',
      container: MediaContainersEnum.Wallpapers,
      name: 'mediaItemName',
    });
  }
}

export = MediaItemFixture;
