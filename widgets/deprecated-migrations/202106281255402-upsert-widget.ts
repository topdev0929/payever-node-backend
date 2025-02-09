import { widgetsFixture } from '../fixtures/widgets.fixture';
import { Db, MongoClient } from 'mongodb';

const widgetsCollection: string = 'widgets';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  // tslint:disable-next-line: await-promise
  const connectDB: Db = client.db();
  
  await connectDB.collection(widgetsCollection).deleteMany({ });
  await connectDB.collection(widgetsCollection).insertMany(widgetsFixture);

  await client.close();
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
