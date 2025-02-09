import { MongoClient } from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  connectDB.collection(integrationsCollection).findOneAndUpdate(
    {name: 'api', category: 'shopsystems'},
    {
      $set: {
        'displayOptions.icon': '#icon-conn-api',
        installationOptions: {
          _id: "b5594097-0000-40e2-ae32-cb0409d0694f",
          countryList: [],
          links: [
            {
              _id: "b5594097-b699-40e2-ae32-cb0409d0694f",
              type: "img",
              url: "https://payeverstaging.blob.core.windows.net/cdn/images/installation/API.png",
            },
          ],
          optionIcon: '#icon-conn-api',
          price : 'integrations.shopsystems.api.price',
          category : 'integrations.shopsystems.api.category',
          developer : 'integrations.shopsystems.api.developer',
          languages : 'integrations.shopsystems.api.languages',
          description : 'integrations.shopsystems.api.description',
          appSupport : 'integrations.shopsystems.api.support_link',
          website : "integrations.shopsystems.api.website_link",
          pricingLink : 'integrations.shopsystems.api.pricing_link',
        },
      },
    },
    {upsert: true});

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
