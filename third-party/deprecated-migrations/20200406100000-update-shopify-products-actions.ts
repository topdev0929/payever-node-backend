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
          {
            _id : '1bb05d5a-5b33-45a1-82db-9383c0edfb1a',
            description: '',
            method: 'POST',
            name: 'create-product',
            url: '/synchronization/create-product/:authorizationId',
          },
          {
            _id : '9b17d5b7-ce70-45cc-8d6e-dc70b2a462fb',
            description: '',
            method: 'PATCH',
            name: 'update-product',
            url: '/synchronization/update-product/:authorizationId',
          },
          {
            _id : 'aa7a1e1f-26ed-4118-974c-1613d7556d58',
            description: '',
            method: 'DELETE',
            name: 'remove-product',
            url: '/synchronization/remove-product/:authorizationId',
          },
          {
            _id : 'a08416be-cbe9-43f5-bd24-b232ab4b032a',
            description: '',
            method: 'PATCH',
            name: 'add-inventory',
            url: '/synchronization/add-inventory/:authorizationId',
          },
          {
            _id : '605cb57f-fae4-429e-afc9-1482c8c82c37',
            description: '',
            method: 'PATCH',
            name: 'subtract-inventory',
            url: '/synchronization/subtract-inventory/:authorizationId',
          },
          {
            _id : '9dac30d5-3821-4746-bffb-817643f20b86',
            description: '',
            method: 'PATCH',
            name: 'set-inventory',
            url: '/synchronization/set-inventory/:authorizationId',
          },
          {
            _id : '37f505a2-a24b-4349-a4e3-df4cf0ad8050',
            description: '',
            method: 'POST',
            name: 'sync-inventory',
            url: '/synchronization/sync-inventory/:authorizationId',
          },
          {
            _id : '7838597e-53e7-4bcc-95f9-a30fdd0d6e78',
            description: '',
            method: 'POST',
            name: 'sync-products',
            url: '/synchronization/sync-products/:authorizationId',
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
