import { BaseMigration } from '@pe/migration-kit';
import { UpdateWriteOpResult } from 'mongodb';

const transactions: string = 'transactions';

export class Migration20230425114900MigrateCleanUpHistoryEventsInSantanderDeInvoice extends BaseMigration {
  public async up(): Promise<void> {
    const resUpdate: UpdateWriteOpResult = await this.connection.collection(transactions).updateMany(
      {
        $or: [
          { status: 'STATUS_PAID'},
          { status: 'STATUS_ACCEPTED'},
        ],
        'created_at': { $gt: new Date('2023-03-15T00:00:00')},
        'history.action': 'cancel',
        'history.payment_status': 'STATUS_CANCELLED',
        'specific_status': { $ne: 'RECEIPT'},
        'type': 'santander_invoice_de',
      },
      {
        $pull: {
          history: {
            $and: [
              {
                $or: [
                  { action: 'cancel'},
                  { action: 'shipping_goods'},
                ],
              },
              {
                created_at: { $lt: new Date('2023-03-30T00:00:00')},
              },
            ],
          },
        },
      },
    );
    
    console.log('Result of payments update: ', resUpdate.result);
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update Santander DE Invoice history';
  }

  public migrationName(): string {
    return 'Migration20230425114900MigrateCleanUpHistoryEventsInSantanderDeInvoice';
  }

  public version(): number {
    return 1;
  }
}
