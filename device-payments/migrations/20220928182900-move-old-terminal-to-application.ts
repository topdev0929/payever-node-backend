import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';

const terminalCollection: string = 'terminals';
const applicationCollection: string = 'applications';
const paymentCodeCollection: string = 'paymentcodes';

export class EmptyMigration extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await copyTerminal(db, terminalCollection, applicationCollection);
    await updatePaymentCode(db, paymentCodeCollection);
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Terminal to Application';
  }

  public migrationName(): string {
    return 'Terminal to Application';
  }

  public version(): number {
    return 1;
  }
}


async function copyTerminal(db: Db, collection: string, collection2: string): Promise<void> {
  let count: number = 0;
  const cursor: any = db.collection(collection).find({});
  while(await cursor.hasNext()) {
    const doc: any = await cursor.next();
    const set: any = {
      applicationId: doc.terminalId,
      businessId: doc.businessId,
      name: doc.name,
      type: `terminal`,
    };

    if (doc.channelSetId && doc.channelSetId !== null) {
      set.channelSetId = doc.channelSetId;
    }
    if (doc.checkout && doc.checkout !== null) {
      set.checkout = doc.checkout;
    }

    try {
      await db.collection(collection2).findOneAndUpdate(
        {
          _id: doc.terminalId,
        },
        {
          $set: set,
        },
        {
          upsert: true,
        }
      );
      count++;

    } catch (e) {
      console.log(e);
      console.log(set);
    }
  }
  console.log(`Done copyTerminal ${count}`);
}

async function updatePaymentCode(db: Db, collection: string): Promise<void> {
  let count: number = 0;
  const cursor: any = db.collection(collection).find({});
  while(await cursor.hasNext()) {
    const doc: any = await cursor.next();
    await db.collection(collection).findOneAndUpdate(
      {
        _id: doc._id,
      },
      {
        $set: {
          applicationId: doc.terminalId,
          type: `terminal`,
        }
      },
    );
    count++;
  }
  console.log(`Done updatePaymentCode ${count}`);
}
