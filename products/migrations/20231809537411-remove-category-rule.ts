// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';

export class RemoveCategoryRule extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const productsConnection: Db = mongoClient.db('products');
    const productsRulesCollection: Collection = productsConnection.collection('rules');

    await productsRulesCollection.deleteMany({ propertyName: 'category', ruleType: 'required' });
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Remove required category rule`;
  }

  public migrationName(): string {
    return RemoveCategoryRule.name;
  }

  public version(): number {
    return 2;
  }
}
