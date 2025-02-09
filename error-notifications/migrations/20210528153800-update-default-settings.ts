'use strict';
import { BaseMigration } from '@pe/migration-kit';
import { ErrorNotificationTypesEnum, CronUpdateIntervalEnum } from '../src/error-notifications/enums';

const settings: string = 'settings';

export class ClearErrorNotifications extends BaseMigration {

  public async up(): Promise<void> {
    await this.connection.collection(settings).updateMany(
      { $or: [
          { type: ErrorNotificationTypesEnum.pspApiFailed },
          { type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid },
          { type: ErrorNotificationTypesEnum.apiKeysInvalid },
        ] },
      {
        $set: {
          updateInterval: CronUpdateIntervalEnum.every5minutes,
        },
      },
    );
  }

  public async down(): Promise<void> {
  }

  public description(): string {
    return 'Update default settings';
  }

  public migrationName(): string {
    return 'UpdateDefaultSettings';
  }

  public version(): number {
    return 1;
  }
}
