import { BaseMigration } from "@pe/migration-kit";
import { Collection, Db, MongoClient } from 'mongodb';

export class RenameTagToAppFieldName extends BaseMigration {
  private async update() {    
    const mongoClient: MongoClient = this.connection.getClient();
    const DB: Db = mongoClient.db();

    const integrationV2Collection: Collection = DB.collection('integrationv2');

    await integrationV2Collection.updateMany({}, {
      $rename: {
        tag: "app"
      }
    });

  }
  public async up() {
    this.update();
  }

  public async down() {
    this.update();
  }

  public description(): string {
    return `Convert tag field to app.`;
  }

  public migrationName(): string {
    return RenameTagToAppFieldName.name;
  }

  public version(): number {
    return 2;
  }
}

