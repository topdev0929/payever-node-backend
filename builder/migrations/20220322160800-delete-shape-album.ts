// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';

export class DeleteShapeAlbum extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    const albums: any[] = await db.collection('shapealbums').find(
      { application: null },
    ).toArray();

    for (const album of albums) {
      await db.collection('shapes').deleteMany(
        { album : album._id },
      );
    }

    await db.collection('shapealbums').deleteMany(
      { application: null },
    );

  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Delete shape album`;
  }

  public migrationName(): string {
    return `Delete shape album`;
  }

  public version(): number {
    return 1;
  }
}
