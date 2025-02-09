const { MongoClient } = require('mongodb');

exports.up = async function(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = client.db();

  await connectDB.collection('chats').deleteMany({
    type: 'integration-channel',
    integrationName: 'internal',
    subType: 'integration',
    title: {
      $regex: /\ Team Chat/,
    },
  });

  await client.close();
};

exports.down = function(db) {
  return null;
};
