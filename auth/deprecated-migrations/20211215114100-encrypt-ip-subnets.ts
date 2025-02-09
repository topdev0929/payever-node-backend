import {
  Db,
  MongoClient,
} from 'mongodb';
import { IpAddressEncoder } from '../src/users';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const locations: any[] = await connectDB.collection('locations').find({ } ).toArray();

  for (const location of locations) {
    const hashedSubnets: string[] = [];

    for (const subnet of location.subnets) {
      const user: any = await connectDB.collection('users').findOne({ _id: location.userId});
      const hash: string = IpAddressEncoder.encodeUsersIpAddress(subnet, user ? user.email : null);
      if (hash) {
        hashedSubnets.push(hash);
      }
      await connectDB.collection('locations').findOneAndUpdate(
        { _id: location._id},
        {
          $set: {
            hashedSubnets,
          },
        },
      );
    }

  }

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
