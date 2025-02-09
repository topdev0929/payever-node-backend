import { BaseMigration } from "@pe/migration-kit";
import { Collection, Db, MongoClient } from 'mongodb';

export class RenameFieldName extends BaseMigration {
  private async update() {
    const mongoClient: MongoClient = this.connection.getClient();
    const usersConnection: Db = mongoClient.db('auth');
    const employeesCollection: Collection = usersConnection.collection('employees');

    await employeesCollection.updateMany({}, {
      $rename: {
        firstName: "firstName",
        lastName: "lastName"
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
    return `Convert two fields firstName and lastName to camelCase.`;
  }

  public migrationName(): string {
    return RenameFieldName.name;
  }

  public version(): number {
    return 2;
  }
}

