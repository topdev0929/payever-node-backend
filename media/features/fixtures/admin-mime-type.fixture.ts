import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { MimeTypeModel } from '../../src/media/models';
import { getModelToken } from '@nestjs/mongoose';
import { MimeTypeSchemaName } from '../../src/media';


class AdminMimeTypeFixture extends BaseFixture {
  private readonly mimeTypeModel: Model<MimeTypeModel> = this.application.get(getModelToken(MimeTypeSchemaName));

  public async apply(): Promise<void> {
    await this.mimeTypeModel.create({
      _id: 'mime-type-1',
      groups: ['g1', 'g2'],
      key: 'jpg',
      name: 'image/jpg',      
    });

    await this.mimeTypeModel.create({
      _id: 'mime-type-2',
      groups: ['g1', 'g2'],
      key: 'png',
      name: 'image/png',
    });

    await this.mimeTypeModel.create({
      _id: 'mime-type-3',
      groups: ['g3', 'g4'],
      key: 'gif',
      name: 'image/gif',
    });

    await this.mimeTypeModel.create({
      _id: 'mime-type-4',
      description: 'description',
      key: 'mp4',
      name: 'video/mp4',
    });
  }
}

export = AdminMimeTypeFixture;
