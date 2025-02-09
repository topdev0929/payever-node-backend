import { Collection } from 'mongodb';
import { connect, connection } from 'mongoose';
import { Business } from '../src/models/interfaces/business';

export async function up(db: any): Promise<void> {
  const cs: string = db.connectionString;
  await connect(
    cs,
    { useNewUrlParser: true },
  );
  try {
    const bc: Collection = connection.db.collection('businesses');
    const businesses: Business[] = await bc.find().toArray();

    for (const business of businesses) {
      if (Array.isArray(business.installedApps)) {
        for (const app of business.installedApps) {
          if (app._id) {
            app.app = app._id;
            delete app._id;
          }
        }

        await bc.findOneAndUpdate({ _id: business._id }, { $set: { installedApps: business.installedApps } });
      }
    }
  } finally {
    await connection.close();
  }
}
