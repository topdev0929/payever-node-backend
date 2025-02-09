import {
    Db,
    MongoClient,
  } from 'mongodb';
  import * as dotenv from "dotenv";

  const integrationsCollection: string = 'integrations';

  async function up(db: any): Promise<void> {
    const client: MongoClient = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB: Db = await client.db();

    await connectDB.collection(integrationsCollection).findOneAndUpdate(
      {
        name: 'ebay',
      },
      {
        $set: {
          connect: {
            formAction: {
              actionEndpoint: "/business/{businessId}/integration/ebay/action/{action}",
              initEndpoint: "/business/{businessId}/integration/ebay/flow"
            },
            url: getServiceUrl('${MICRO_URL_THIRD_PARTY_PRODUCTS}/api')
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
      matches = regex.exec(url)
    }

    return url;
  }

  module.exports.up = up;
  module.exports.down = down;
