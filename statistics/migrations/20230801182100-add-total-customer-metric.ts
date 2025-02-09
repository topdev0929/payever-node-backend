'use strict';

import { BaseMigration } from '@pe/migration-kit';

import { Collection, Db, MongoClient } from 'mongodb';

export class AddTotalCustomerMetric extends BaseMigration {

  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();
    const metricCollection: Collection = db.collection(`metrics`);

    await metricCollection.insertOne({
      "name": "countCustomers",
      "types": [
        "transactions"
      ],
      "group": "Conversion Metric",
      "sizes": [
        "small",
        "medium",
        "large"
      ]
    });
  }

  public async down(): Promise<void> { };

  public description(): string {
    return 'Add Total Customer Metric';
  };

  public migrationName(): string {
    return 'Add Total Customer Metric';
  }

  public version(): number {
    return 2
  }
}
