import { Db, MongoClient } from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = await client.db();

  await connectDB.collection('integrations').updateOne(
    {
      name: 'shopify',
    },
    {
      $set: {
        actions: [
          {
            _id : '93a86176-f3e4-11e9-91cb-fbdf5b1307a1',
            description : '',
            method : 'POST',
            name : 'connect',
            url : '/auth',
          },
          {
            _id : '8f3f6b16-f3e4-11e9-b158-e731405eba41',
            description : '',
            method : 'DELETE',
            name : 'disconnect',
            url : '/auth/:authorizationId',
          },
        ],
      },
    },
  );

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
