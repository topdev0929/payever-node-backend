'use strict';
import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';

export class UpdateFinanceExpress extends BaseMigration {

  public async up(): Promise<void> {
    for (const integration of integrationsFixture) {
      if (integration.code !== 'finance-express') {
        continue;
      }

      await this.connection.collection('integrations').findOneAndUpdate(
        {
          _id: integration._id,
        },
        {
          $set: integration,
        },
        {
          upsert: true,
        },
      );
    }
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return 'Updates finance express integration';
  }

  public migrationName(): string {
    return '20201229122100-UpdateFinanceExpress';
  }

  public version(): number {
    return 8;
  }

}

exports.UpdateFinanceExpress = UpdateFinanceExpress;

