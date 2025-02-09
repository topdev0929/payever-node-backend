import {
  Db,
  MongoClient
} from 'mongodb';
import * as dotenv from 'dotenv'

const integrationCollection: string = 'integrations'

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect()
  const connectDB: Db = await client.db()

  await connectDB.collection(integrationCollection).findOneAndUpdate(
    {
      name: "autoscout",
    },
    {
      $set: {
        connect: {
          formAction: {
            actionEndpoint: "/business/{businessId}/integration/autoscout/action/{action}",
            initEndpoint: "/business/{businessId}/integration/autoscout/form",
          },
          url: getServiceUrl('${MICRO_URL_THIRD_PARTY_PRODUCTS}/api'),
        },
      },
    },
  );
  await client.close()

  return null;
}

function down(): Promise<void> {
  return null;
}

function getServiceUrl(identifier: string): string {
  dotenv.config()
  const regExp: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regExp.exec(url)

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regExp.exec(url)
  }

  return null;
}

module.exports.up = up;
module.exports.down = down;
