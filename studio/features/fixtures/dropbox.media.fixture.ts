import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { DropboxMediaModel } from '../../src/studio/models';
import { DropboxMediaSchemaName } from '../../src/studio/schemas';

class DropboxMediaFixture extends BaseFixture {
  private readonly dropboxMediaModel: Model<DropboxMediaModel>
    = this.application.get(getModelToken(DropboxMediaSchemaName));

  public async apply(): Promise<void> {
    const dropboxMedia: any[] = [
      {
        _id: 'c61ccd5f-f6fa-4af2-a6c6-dccea9d71b47',
        createdAt: '2021-03-03T10:35:16.268Z',
        downloaded: false,
        isDownloadable: true,
        lastModified: '2020-05-14T17:07:59.000Z',
        name: 'img1.png',
        path: '/storage server/payever media/img1.png',
        size: 14856123,
        sourceId: 'id:KBjBsL4dyDoAAAAAAAA1kg',
        type: 'image',
        updatedAt: '2021-03-03T10:35:16.268Z',
      },
      {
        _id: '1ddeaf05-c728-44c5-a5c5-5eec072e311f',
        createdAt: '2021-03-03T10:47:34.212Z',
        downloaded: false,
        isDownloadable: true,
        lastModified: '2020-06-12T15:56:25.000Z',
        name: 'img2.jpg',
        path: '/storage server/payever media/img2.jpg',
        size: 14855783,
        sourceId: 'id:KBjBsL4dyDoAAAAAAAA1-w',
        type: 'image',
        updatedAt: '2021-03-03T10:47:34.212Z',
      },
      {
        _id: '53453f49-9372-4116-be38-2dd19f41744a',
        createdAt: '2021-03-03T09:00:18.054Z',
        lastModified: '2020-04-15T09:01:16.000Z',
        name: 'vid1.mov',
        path: '/storage server/payever media/vid1.mov',
        sourceId: 'id:KBjBsL4dyDoAAAAAAAAiSg',
        type: 'video',
        updatedAt: '2021-03-03T09:00:18.054Z',
      },
      {
        _id: '57248822-6d67-4a83-97b6-ef5c9d97b6dd',
        createdAt: '2021-03-03T09:00:18.057Z',
        lastModified: '2020-04-15T09:04:19.000Z',
        name: 'vid2.mp4',
        path: '/storage server/payever media/vid2.mp4',
        sourceId: 'id:KBjBsL4dyDoAAAAAAAAiSw',
        type: 'video',
        updatedAt: '2021-03-03T09:00:18.057Z',
      },
      {
        _id: '57248822-6d67-4a83-97b6-ef5c9d97b6d0',
        createdAt: '2021-03-03T09:00:18.057Z',
        lastError: true,
        lastModified: '2020-04-15T09:04:19.000Z',
        name: 'vid2.mp4',
        path: '/storage server/payever media/vid2.mp4',
        sourceId: 'id:KBjBsL4dyDoAAAAAAAAiSn',
        tries: 2,
        type: 'video',
        updatedAt: '2021-03-03T09:00:18.057Z',
      },
    ];
    await this.dropboxMediaModel.create(dropboxMedia);
  }
}

export = DropboxMediaFixture;
