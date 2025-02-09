import * as uuid from 'uuid';
import { BaseMigration } from '@pe/migration-kit';
import { BusinessSchemaName } from '../src/business/schemas';
import { UserAlbumSchemaName } from '../src/studio/schemas';
import { Model } from 'mongoose';

export class SampleAttributesAndMedias extends BaseMigration {
  public async up(): Promise<void> {
    const businessModel: Model<any> = this.connection.model(BusinessSchemaName);
    const userAlbum: Model<any> = this.connection.model(UserAlbumSchemaName);

    const businesses: any[] = await businessModel.find();
    for (const business of businesses) {
      const photos: any = await userAlbum.findOne({ business: business._id, name: 'Photos' });
      if (!photos) {
        userAlbum.create({ _id: uuid.v4(), business: business._id, name: 'Photos', parent: null, ancestors: [] });
      }
      const videos: any = await userAlbum.findOne({ business: business._id, name: 'Videos' });
      if (!videos) {
        userAlbum.create({ _id: uuid.v4(), business: business._id, name: 'Videos', parent: null, ancestors: [] });
      }
    }
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return '';
  }

  public migrationName(): string {
    return 'DefaultUserAlbum';
  }

  public version(): number {
    return 1;
  }
}
