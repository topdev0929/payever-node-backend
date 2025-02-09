import { Db, MongoClient } from 'mongodb';

import { categories } from '../fixtures/categories.fixture';

const categoriesCollection: string = 'categories';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = client.db();

  for (const category of categories) {
    await connectDB.collection(categoriesCollection).findOneAndUpdate(
      {
        _id: category._id,
      },
      {
        $set: category,
      },
      {
        upsert: true,
      },
    );
  }

  await client.close();
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
