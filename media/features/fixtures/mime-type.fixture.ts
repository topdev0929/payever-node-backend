import { BaseFixture } from '@pe/cucumber-sdk/module';
import { MediaContainersEnum } from '@pe/media-sdk';
import { Model } from 'mongoose';
import { MimeTypeModel } from '../../src/media';
import { defaultMimeTypes } from '../../fixtures/default-mime-types.fixture';

class MimeTypeFixture extends BaseFixture {
  private readonly mimeTypeModel: Model<MimeTypeModel> = this.application.get('MimeTypeModel');

  public async apply(): Promise<void> {
    for (const mimeType of defaultMimeTypes) {
      await this.mimeTypeModel.create(mimeType);
    }
  }
}

export = MimeTypeFixture;
