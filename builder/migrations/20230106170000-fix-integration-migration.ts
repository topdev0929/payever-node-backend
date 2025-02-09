// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

export class FixIntegrationMigration extends BaseMigration {
  public async up(): Promise<void> {
    try {
      await this.connection.collection('integrationcontexts')
        .dropIndex(`integration_1_url_1_method_1_query_1`);
    } catch (_) { }

    try {
      await this.connection.collection('integrationcontexts')
        .dropIndex(`integration_1_url_1_method_1`);
    } catch (_) { }
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Fix Integration Migration`;
  }

  public migrationName(): string {
    return `Fix Integration Migration`;
  }

  public version(): number {
    return 1;
  }
}
