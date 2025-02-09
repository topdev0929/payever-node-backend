import { BaseMigration } from "@pe/migration-kit";
import { Collection, Db, MongoClient } from 'mongodb';

export class RenameFieldName extends BaseMigration {
  private async update() {
    const mongoClient: MongoClient = this.connection.getClient();
    const usersConnection: Db = mongoClient.db('users');
    const employeesCollection: Collection = usersConnection.collection('employees');

    await employeesCollection.updateMany({}, {
      $rename: {
        first_name: "firstName",
        last_name: "lastName"
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
    return `Convert two fields first_name and last_name to camelCase.`;
  }

  public migrationName(): string {
    return RenameFieldName.name;
  }

  public version(): number {
    return 2;
  }
}

