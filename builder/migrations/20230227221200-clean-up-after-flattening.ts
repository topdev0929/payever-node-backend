// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';

export class CleanUpAfterFlattening extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const DB: Db = mongoClient.db();

    await DB.collection(`applicationpages`).updateMany(
      { },
      {
        $unset: {
          lastActionId: '',
          migrationVersion: '',
          contextId: '',
          context: '',
          stylesheetIds: '',
          stylesheets: '',
          templateId: '',
          template: '',
        }
      }
    );
    await DB.collection(`themes`).updateMany(
      { },
      {
        $unset: {
          migrationVersion: '',
        }
      }
    );
    await DB.collection(`themesnapshots`).updateMany(
      { },
      {
        $unset: {
          lastActionId: '',
          lastPublishedActionId: '',
        }
      }
    );
    await DB.collection(`themepages`).updateMany(
      { },
      {
        $unset: {
          context: '',
          stylesheets: '',
          template: '',
          migrationVersion: '',
        }
      }
    );
    await DB.collection(`themeelements`).updateMany(
      { },
      {
        $unset: {
          migrationVersion: '',
        }
      }
    );

    await drop(DB, `themeactions`);
    await drop(DB, `themestatehistories`);
    await drop(DB, `themestylesheets`);
    await drop(DB, `themetemplates`);
    await drop(DB, `themecontexts`);
    await drop(DB, `themeactioneffects`);
    await drop(DB, `visitorthemeactioneffects`);
    await drop(DB, `publishneedupdates`);
    await drop(DB, `processlogs`);

    await drop(DB, `appointments`);
    await drop(DB, `appointmentavailabilities`);
    await drop(DB, `appointmentfields`);
    await drop(DB, `appointmentnetworks`);
    await drop(DB, `appointmenttypes`);
    await drop(DB, `baserules`);
    await drop(DB, `categories`);
    await drop(DB, `collections`);
    await drop(DB, `custom-accesses`);
    await drop(DB, `defaultcategories`);
    await drop(DB, `domains`);
    await drop(DB, `fields`);
    await drop(DB, `marketplaceassigments`);
    await drop(DB, `marketplaces`);
    await drop(DB, `pendingactions`);
    await drop(DB, `products`);
    await drop(DB, `productcategories`);
    await drop(DB, `productcountrysettings`);
    await drop(DB, `productrecommendations`);
    await drop(DB, `producttranslations`);
    await drop(DB, `sampleproducts`);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Clean up after flattening`;
  }

  public migrationName(): string {
    return `Clean up after flattening`;
  }

  public version(): number {
    return 1;
  }
}

async function drop(DB: Db, collection: string): Promise<void> {
  try {
    await DB.collection(collection).drop();
  } catch (e) { }
}
