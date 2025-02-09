// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';

export class UpdateBusinessIdForProductsMigration extends BaseMigration {
  public async up(): Promise<void> {
    await this.connection.collection('folders').deleteMany(
      {
        name: 'All',
      },
    );
    await this.connection.collection('folders').deleteMany(
      {
        name: 'payever Market',
      },
    );

    await this.connection.collection('folders').update(
      {
        createdBy: 'merchant',
      },
      {
        $set: {
          scope: 'business',
        },
      },
      {
        multi: true,
        upsert: false,
      },
    );

    await this.connection.collection('folders').update(
      {
        createdBy: 'admin',
      },
      {
        $set: {
          scope: 'default',
        },
      },
      {
        multi: true,
        upsert: false,
      },
    );
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Update folders for scope';
  }
  public migrationName(): string {
    return '20220128123313-update-folders-for-scope';
  }
  public version(): number {
    return 1;
  }
}
