import { Db, MongoClient } from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = await client.db();

  await connectDB.collection('integrations').updateOne(
    {
      name: 'twilio',
    },
    {
      $set: {
        actions: [
          {
            _id : '93a86176-f3e4-11e9-91cb-fbdf5b1307ad',
            description : '',
            method : 'POST',
            name : 'connect',
            url : '/auth',
          },
          {
            _id : '8f3f6b16-f3e4-11e9-b158-e731405eba42',
            description : '',
            method : 'DELETE',
            name : 'disconnect',
            url : '/auth/:authorizationId',
          },
          {
            _id : '96d79027-56b8-4aee-832a-41b8a687fef8',
            description : '',
            method : 'POST',
            name : 'form',
            url : '/form',
          },
          {
            _id : 'c214fc69-5787-4cc9-b07f-8dd7307e78e2',
            description : '',
            method : 'POST',
            name : 'list',
            url : '/form/list',
          },
          {
            _id : '0843d58f-66ca-4881-bc38-25e3e0337e1e',
            description : '',
            method : 'POST',
            name : 'save-credentials',
            url : '/form/save-credentials',
          },
          {
            _id : '0d87fe18-ddb7-44b5-a2dd-2372e62f0ea8',
            description : '',
            method : 'POST',
            name : 'reset-credentials',
            url : '/form/reset-credentials',
          },
          {
            _id : '7294efad-5367-47b9-8fff-570f018e9bd0',
            description : '',
            method : 'POST',
            name : 'add-number',
            url : '/form/add-number',
          },
          {
            _id : 'ab53d9ca-646a-4069-81c6-14bddf1a793c',
            description : '',
            method : 'POST',
            name : 'purchase-number',
            url : '/form/purchase-number',
          },
          {
            _id : 'e4a19d29-a859-4d31-a305-2873d8a19dd3',
            description : '',
            method : 'POST',
            name : 'remove-number',
            url : '/form/remove-number',
          },
          {
            _id : '90b0f949-af47-4ab2-8fe6-42246209e53c',
            description : '',
            method : 'POST',
            name : 'search-numbers',
            url : '/form/search-numbers',
          },
          {
            _id : '3c11ea5f-1e94-4631-8f0c-d929456c9e58',
            description : '',
            method : 'POST',
            name : 'purchase-number-form',
            url : '/form/purchase-number-form',
          },
          {
            _id : '07887416-51fe-40c5-90c0-1e8fcbdb528e',
            description : '',
            method : 'POST',
            name : 'remove-number-form',
            url : '/form/remove-number-form',
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
