import * as uuid from 'uuid';
import { BaseMigration } from '@pe/migration-kit';
import { BusinessSchemaName } from '../src/business/schemas';
import { UserAlbumSchemaName } from '../src/studio/schemas';
import { Model } from 'mongoose';
import { FolderSchemaName } from '@pe/folders-plugin';

export class MigrateHasChildFolder extends BaseMigration {
  public async up(): Promise<void> {
    const folderModel: Model<any> = this.connection.model(FolderSchemaName);
    const folders: any[] = await folderModel.find();
    for (const folder of folders) {
      if (folder.parentFolder) {
        await folderModel.findOneAndUpdate(
          {
            _id: folder.parentFolder,
          },
          {
            $set: {
              hasChildren: true,
            },
          },
        );
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
    return 'HasChildFolder';
  }

  public version(): number {
    return 1;
  }
}
