import { BaseMigration } from '@pe/migration-kit';

const transactions: string = 'transactions';

export class Migration20230413171700MigrateSantanderDeRefundBeforeCapture extends BaseMigration {
  public async up(): Promise<void> {
    await this.connection.collection(transactions).updateMany(
      {
        $and: [
          { 'history.action': { $nin: ['shipping_goods'] }},
          { 'history.action': { $in: ['refund'] }},
        ],
        status: 'STATUS_REFUNDED',
        type: 'santander_invoice_de',
      },
      {
        $set: { 'history.$[position].action': 'cancel' },
      },
      { arrayFilters: [ { 'position.action': 'refund' } ]},
    );
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update Santander DE history';
  }

  public migrationName(): string {
    return 'Migration20230413171700MigrateSantanderDeRefundBeforeCapture';
  }

  public version(): number {
    return 1;
  }
}
