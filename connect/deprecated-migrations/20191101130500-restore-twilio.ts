import {
  MongoClient,
} from 'mongodb';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  await connectDB.collection('integrations').insertOne(
    {
      _id: '6fc2e9be-bc7e-4c14-9f88-d3f9ffce9ba5',
      name: 'twilio',
      category: 'communications',
      displayOptions: {
        _id: '84a7e4aa-8a39-4778-a8c7-28b7c908ba37',
        icon: '#icon-communication-twillio',
        title: 'integrations.communications.twilio.title',
      },
      installationOptions: {
        countryList: [],
        _id: 'a55e3e0a-edc7-4fe3-86ea-cbf630acb79c',
        links: [
          {
            _id: '3738f3e6-95e2-48f3-af86-46380376261c',
            type: 'img',
            url: 'https://payeverstaging.blob.core.windows.net/products/2bc1fe1f-ecd2-4bf8-a252-87dcfaa6e1e4-Twilio-min.png',
          },
        ],
        optionIcon: '#icon-communication-twillio',
        price: 'integrations.communications.twilio.price',
        category: 'integrations.communications.twilio.category',
        developer: 'integrations.communications.twilio.developer',
        languages: 'integrations.communications.twilio.languages',
        description: 'integrations.communications.twilio.description',
        appSupport: 'integrations.communications.twilio.support_link',
        website: 'https://getpayever.com/connect/',
        pricingLink: 'https://www.twilio.com/products',
      },
      createdAt: '2018-11-12T18:13:41.339+0000',
      updatedAt: '2018-11-12T18:13:41.339+0000',
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
