import * as dotenv from 'dotenv';
import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const integrationsCollection: string = 'integrations';

  const client: MongoClient =
    await MongoClient.connect(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  const connectDB: Db = client.db();

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      name: 'santander_installment_dk',
    },
    {
      $set: {
        connect: {
          formAction: {
            actionEndpoint: '/business/{businessId}/integration/santander_installment_dk/action/{action}',
            initEndpoint: '/business/{businessId}/integration/santander_installment_dk/form',
          },
          url: getServiceUrl('${MICRO_URL_THIRD_PARTY_PAYMENTS}/api'),
        },
      },
    },
  );
  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

function getServiceUrl(identifier: string): string {
  dotenv.config();
  const regex: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url);
  }

  return url;
}

module.exports.up = up;
module.exports.down = down;
