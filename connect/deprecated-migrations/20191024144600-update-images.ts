import {
  MongoClient,
} from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  const collection = connectDB.collection(integrationsCollection);

  const methodToImage = {
    'santander_ccp_installment': 'eCom_DE',
    'santander_installment': 'eCom_DE',
    'santander_installment_dk': 'eCom_DK',
    'santander_installment_no': 'eCom_NW',
    'santander_installment_se': 'eCom_SE',

    'santander_invoice_de': 'eCom_DE',
    'santander_invoice_no': 'eCom_NW',

    'santander_factoring_de': 'eCom_DE',

    'santander_pos_factoring_de': 'POS_DE',
    'santander_pos_installment': 'POS_DE',
    'santander_pos_installment_se': 'POS_SE',
    'santander_pos_invoice_de': 'POS_DE',
  };

  const items = collection.find({ name: { $in: Object.keys(methodToImage) } });

  while (await items.hasNext()) {
    const integration: any = await items.next();

    for (const imgLink of integration.installationOptions.links) {
      if (imgLink.type === 'img') {
        imgLink.url = `https://payeverstage.azureedge.net/images/installation/${methodToImage[integration.name]}.png`;
        break;
      }
    }

    await collection.updateOne({ _id: integration._id }, {
        $set: {
            'installationOptions.links': integration.installationOptions.links,
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
