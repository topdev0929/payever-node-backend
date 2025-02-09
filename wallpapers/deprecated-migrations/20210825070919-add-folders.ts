import { MongoClient } from 'mongodb';
import { folders } from '../fixtures/folders.fixture';

const folderCollection: string = 'folders';

async function up(db:any): Promise<void>  {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const wallDb: any = await client.db();
  await wallDb.collection(folderCollection).deleteMany(
    { createdBy: 'admin' },
  );

  for (const entity of folders) {
    const set: any = {
      ...entity,
    };

    delete set._id;

    try {
      await wallDb.collection(folderCollection).findOneAndUpdate(
        { _id: entity._id },
        {
          $set: set,
        },
        { upsert: true },
      );
    } catch (e) {
      console.log(e);
    }
  }

  return null;
}

function down(): Promise<void>  {
  return null;
}

module.exports.up = up;
module.exports.down = down;
