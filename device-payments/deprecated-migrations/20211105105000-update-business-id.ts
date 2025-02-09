import { Db, MongoClient } from 'mongodb';
import { BusinessModel } from '../src/interfaces';
import { VerificationType } from '../src/enum';

export async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const businesses: BusinessModel[] = await connectDB
    .collection('businesses')
    .find({ })
    .toArray()
  ;

  for (const business of businesses) {
    const oldDocId: any = business._id;
    const existing: BusinessModel = typeof oldDocId === 'object'
      ? await connectDB.collection('businesses').findOne({ _id: business.businessId})
      : business;

    if (existing) {
      await prepareExistingEntry(existing, business, connectDB);

      if (typeof oldDocId === 'object') {
        await connectDB.collection('businesses').deleteOne({ _id: oldDocId });
      }

      continue;
    }

    business._id = business.businessId;
    if (!business.settings) {
      business.settings = {
        autoresponderEnabled: true,
        enabled: false,
        secondFactor: false,
        verificationType: VerificationType.verifyByPayment,
      };
    }

    await connectDB.collection('businesses').insertOne(business);
    await connectDB.collection('businesses').deleteOne({ _id: oldDocId });
  }

  await client.close();
}

export function down(): Promise<void> {
  return null;
}

async function prepareExistingEntry(
  existing: BusinessModel,
  business: BusinessModel,
  connectDB: Db,
): Promise<void> {
  if (!existing.defaultTerminalId && business.defaultTerminalId) {
    existing.defaultTerminalId = business.defaultTerminalId;
  }

  if (!existing.settings && business.settings) {
    existing.settings = business.settings;
  }

  if (!existing.settings) {
    existing.settings = {
      autoresponderEnabled: true,
      enabled: false,
      secondFactor: false,
      verificationType: VerificationType.verifyByPayment,
    };
  }

  if (!existing.businessId) {
    existing.businessId = existing._id;
  }

  await connectDB.collection('businesses').updateOne({ _id: existing._id}, { $set: existing});
}
