import { MongoClient } from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
    const client = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB = await client.db();

    connectDB.collection(integrationsCollection).findOneAndUpdate(
      {name: 'api', category: 'shopsystems'},
      {$set: {installationOptions:{
        links: [
          {
            _id: 'b5594097-b699-40e2-ae32-cb0409d0694f',
            type: 'img',
            url: 'https://payeverstaging.blob.core.windows.net/cdn/images/installation/API.png',
          },
        ],
      }}},
      {upsert:true});

    await client.close();

    return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
