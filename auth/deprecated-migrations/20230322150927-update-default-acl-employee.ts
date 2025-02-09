import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const oldDefaultAcl: any = {
    microservice: 'commerceos',
    read: true,
  };

  const permissions: any[] = await connectDB.collection('permissions').find({
    $and: [
      { acls: { $elemMatch: { $eq: oldDefaultAcl } } },
      { userId: { $exists: true } },
      { role: { $eq: 'merchant' } },
    ],
  }).toArray();

  const newDefaultAcl: any = {
    create: true,
    delete: true,
    microservice: 'commerceos',
    read: true,
    update: true,
  };

  for (const permission of permissions) {
    const newAcls: any[] = permission.acls?.map((acl: any) => {
      if (acl.microservice === 'commerceos') {
        return newDefaultAcl;
      }

      return acl;
    }) || [];

    await connectDB.collection('permissions').findOneAndUpdate(
      { _id: permission._id },
      {
        $set: {
          acls: newAcls,
        },
      },
    );
  }

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
