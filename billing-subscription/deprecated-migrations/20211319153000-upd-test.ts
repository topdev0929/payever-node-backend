import { MongoClient } from 'mongodb';
import * as fs from 'fs';

const integrationsCollection: string = 'applicationpages';

async function up(db: any): Promise<any> {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const shopDb: any = await client.db();

  const themeJson: string = fs.readFileSync(
    './migrations/app.json',
    'utf-8',
  );
  const theme: any = JSON.parse(themeJson);
  await upsert(shopDb, `applicationpages`, [theme]);

  return null;
}

function down(): any {
  return null;
}

async function upsert(shopDb: any, collection: string, datas: any[]): Promise<void> {
  for (const data of datas) {
    const set: any = {
      ...data,
    };

    set.createdAt = new Date(set.createdAt.$date);
    set.updatedAt = new Date(set.updatedAt.$date);
    delete set._id;

    await shopDb.collection(collection).findOneAndUpdate(
      { _id: data._id},
      {
        $set: set,
      },
      { upsert: true },
    );
  }
}


module.exports.up = up;
module.exports.down = down;
