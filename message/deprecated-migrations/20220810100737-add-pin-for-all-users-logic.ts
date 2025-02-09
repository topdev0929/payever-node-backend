import { Db, MongoClient } from 'mongodb';


module.exports.up = async (db: any) => {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  await connectDB.collection('chats').updateMany(
    { 'pinned.users': { $exists: true } },
    {
      $set: {
        'pinned.$[elem].forAllUsers': true,
      },
      $unset: {
        'pinned.$[].users': 1,
      },
    },
    {
      arrayFilters: [{ 'elem._id': { $exists: true } }],
    },
  );

  await client.close();
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };

