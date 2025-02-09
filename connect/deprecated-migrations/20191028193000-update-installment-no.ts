import {
  MongoClient,
} from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      name: 'santander_installment_no',
    },
    {
      $set: {
        'displayOptions.title': 'integrations.payments.santander_installment_no.title',
        'installationOptions.category' : 'integrations.payments.santander_installment_no.category',
        'installationOptions.description' : 'integrations.payments.santander_installment_no.description',
        'installationOptions.developer' : 'integrations.payments.santander_installment_no.developer',
        'installationOptions.languages' : 'integrations.payments.santander_installment_no.languages',
        'installationOptions.price': 'integrations.payments.santander_installment_no.price',
        'installationOptions.pricingLink' : 'integrations.payments.santander_installment_no.pricing_link',
        'installationOptions.website' : 'integrations.payments.santander_installment_no.website_link',
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
