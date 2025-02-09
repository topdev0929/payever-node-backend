import { MongoClient } from 'mongodb';
import { ProductsIntegrationActionsFixture } from '../fixtures/products-integration-actions.fixture';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  await connectDB.collection('integrations').updateMany(
      {
        category: 'shopsystems',
        name: {
          $ne: 'shopify',
        },
      },
      {
        $set: {
          actions: ProductsIntegrationActionsFixture,
        },
      },
    );

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
