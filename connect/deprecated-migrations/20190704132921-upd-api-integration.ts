import {
  MongoClient,
} from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {

  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  connectDB.collection(integrationsCollection)
    .findOneAndUpdate({
      name: 'api',
      category: 'shopsystems',
    },                {
      $set: {
        displayOptions: {
          _id: 'd32ea486-b8e8-41e8-849c-40202988c801',
          icon: '#icon-api',
          title: 'integrations.shopsystems.api.title',
        },
        installationOptions: {
          links: [{
            _id: 'b5594097-b699-40e2-ae32-cb0409d0694f',
            type: 'img',
            url: 'https://payeverstaging.blob.core.windows.net/cdn/images/installation/api-green.png',
          } ],
          optionIcon: '#icon-api',
          price: 'integrations.shopsystems.api.price',
          category: 'integrations.shopsystems.api.category',
          developer: 'integrations.shopsystems.api.developer',
          languages: 'integrations.shopsystems.api.languages',
          description: 'integrations.shopsystems.api.description',
          appSupport: 'integrations.shopsystems.api.support_link',
          website: 'https://getpayever.com/connect/',
          pricingLink: 'https://getpayever.com/developer/api-documentation/',
        },
      },
    },                {
      upsert: true,
    });
  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
