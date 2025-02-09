// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { RuleInterface } from '@pe/products-sdk';
import { Collection, Db, MongoClient } from 'mongodb';
import * as uuid from 'uuid';

type RuleDocument = RuleInterface & { _id: string };

export class AddRulesInAmazon extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const productsConnection: Db = mongoClient.db('products');
    const productsRulesCollection: Collection = productsConnection.collection('rules');
    const rules: RuleDocument[] = [
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'categories',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'barcode',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'shipping.height',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'shipping.length',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'shipping.width',
        regEx: '',
        ruleType: 'required',
      },
      {
        _id: uuid.v4(),
        integrationName: 'amazon',
        propertyName: 'shipping.weight',
        regEx: '',
        ruleType: 'required',
      },
    ];

    await productsRulesCollection.insertMany(rules);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Adds new rules for Amazon integration`;
  }

  public migrationName(): string {
    return AddRulesInAmazon.name;
  }

  public version(): number {
    return 1;
  }
}
