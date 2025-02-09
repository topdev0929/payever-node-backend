import { BaseMigration } from '@pe/migration-kit';
import { RuleInterface } from '@pe/products-sdk';
import { Collection, Db, MongoClient } from 'mongodb';
import * as uuid from 'uuid';

type RuleDocument = RuleInterface & { _id: string };

export class AddRulesToProductBrand extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const productsConnection: Db = mongoClient.db('products');
    const productsRulesCollection: Collection = productsConnection.collection('rules');
    const newRules: RuleDocument[] = [
      {
        _id: uuid.v4(),
        integrationName: 'google_shopping',
        propertyName: 'brand',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'ebay',
        propertyName: 'brand',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'brand',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'facebook',
        propertyName: 'brand',
        regEx: '',
        ruleType: 'required',
      },
    ];

    await productsRulesCollection.insertMany(newRules);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return 'Adds new rules to product brand';
  }

  public migrationName(): string {
    return AddRulesToProductBrand.name;
  }

  public version(): number {
    return 1;
  }
}
