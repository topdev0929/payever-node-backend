'use strict';

import { BaseMigration } from '@pe/migration-kit';

const checkoutCollection: string = 'checkouts';

export class AddNLLanguageMigration extends BaseMigration {

  public async up(): Promise<void> {


    await this.connection.collection(checkoutCollection).updateMany(
      { },
      {
        $push:
          {
            'settings.languages': {
              active: false,
              isDefault: false,
              code: 'nl',
              name: 'Dutch',
            },
          },
      },
    );


    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update checkout settings';
  }

  public migrationName(): string {
    return 'AddNLLanguageMigration';
  }

  public version(): number {
    return 1;
  }
}
