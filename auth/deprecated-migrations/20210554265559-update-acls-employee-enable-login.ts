import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({
    $nor: [
      { acls: { $exists: false }},
      { acls: { $size: 0} },
    ],
    acls: { 
      $elemMatch: {
        microservice : 'commerceos',
      },
    },
  }).toArray();

  for (const employee of employees) {
    const acls: any = employee.acls.filter((acl: any) => {
      return acl.microservice !== 'commerceos';
    });

    await connectDB.collection('employees').findOneAndUpdate(
      { _id: employee._id },
      {
        $set: {
          acls: [
            ...acls,
            {
              create : true,
              delete : true,
              microservice : 'commerceos',
              read : true,
              update : true,
            },
          ],
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
