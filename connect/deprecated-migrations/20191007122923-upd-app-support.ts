import {
  MongoClient,
} from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  const collection = connectDB.collection(integrationsCollection);
  const items = collection.find({});

  while (await items.hasNext()) {
    const integration: any = await items.next();
    await collection.updateOne({ _id: integration._id }, {
        $set: {
            'installationOptions.appSupport': `integrations.${integration.category}.${integration.name}.support_link`,
        },
    });
  }

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
