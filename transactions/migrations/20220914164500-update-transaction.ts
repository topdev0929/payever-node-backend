import { BaseMigration } from '@pe/migration-kit';

const transactions: string = 'transactions';

export class Migration20220914164500UpdateTransactionOfOtherShopSystem extends BaseMigration {
  public async up(): Promise<void> {
    await this.connection.collection(transactions).updateMany(
      {
        channel: 'other_shopsystem',
      },
      {
        $set: {
          channel: 'api',
        },
      },
    );
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update transaction of other shopSystem';
  }

  public migrationName(): string {
    return 'Migration20220914164500UpdateTransactionOfOtherShopSystem';
  }

  public version(): number {
    return 1;
  }
}
