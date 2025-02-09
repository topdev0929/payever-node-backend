'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { Collection, MongoClient } from 'mongodb';

export class SetIsDefaultDashboard extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const dashboardCollection: Collection = await mongoClient.db('statistics').collection('dashboards');

    const uniqueBusinessIds: any[] = await dashboardCollection
      .distinct('businessId');
    const dashboardsToSet: string[] = [];
    for (const businessId of uniqueBusinessIds) {
      const defaultDashboard = await dashboardCollection
        .findOne({
          businessId: businessId,
          isDefault: true
        });

      if (!defaultDashboard) {
        const firstDashboard = await dashboardCollection
          .findOne({ businessId: businessId });
        if (firstDashboard) {
          dashboardsToSet.push(firstDashboard._id);
        }
      }
    }
    
    await dashboardCollection.updateMany({
      _id: { $in: dashboardsToSet }
    }, {
      $set: {
        isDefault: true,
      },
    });
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return '';
  }

  public migrationName(): string {
    return 'Set Default Dashboard';
  }

  public version(): number {
    return 1;
  }
}
