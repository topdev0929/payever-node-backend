import {
  Db,
  MongoClient,
} from 'mongodb';
import { v4 as uuid } from 'uuid';
import { blockedEmails } from '../fixtures/blocked-emails'; 

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  await connectDB.collection('blocked-emails')
    .insertMany(blockedEmails.map((email: any) => ({ ...email, _id: uuid() })));

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
