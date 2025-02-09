import { BaseMigration } from '@pe/migration-kit';
import { MailServerConfigsFixture } from '../fixtures/mail-server-configs.fixture';
import { MailServerConfigInterface } from '../src/mailer/interfaces';
import { environment } from '../src/environments';

const serverTypesCollection: string = 'mailserverconfigs';

export class fillMailServerConfigs extends BaseMigration {
  public async up(): Promise<void> {

    const filter: string = environment.appNameSpace === 'production' ? 'LIVE' : 'TEST';
    const serverConfigs: MailServerConfigInterface[] = MailServerConfigsFixture.filter(
      (item: MailServerConfigInterface) => item.env === filter,
    );

    for (const serverConfig of serverConfigs) {
      await this.connection.collection(serverTypesCollection).findOneAndUpdate(
        {
          serverType: serverConfig.serverType,
        },
        {
          $set: serverConfig,
        },
        {
          upsert: true,
        },
      );
    }

  }

  public async down(): Promise<void> {};

  public description(): string {
    return 'Fill mail server configs'
  };

  public migrationName(): string {
    return 'fillMailServerConfigs'
  }

  public version(): number {
    return 1
  }
}
