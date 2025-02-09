import { integrationsFixture } from '../fixtures/integrations.fixture';
import {
  MongoClient,
} from 'mongodb';

const integrationsCollection = 'integrations';
const synchronizationsCollection = 'synchronizations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  const syncronizations = await connectDB.collection('synchronizations').aggregate([{
    $lookup: {
            from: integrationsCollection,
            localField: "integration",
            foreignField: "_id",
            as: "integrations"
        }
    },{
       $project:
          {
            integrations: "$integrations",
            _id: "$_id"
          }
     }
  ]).toArray();
  syncronizations.forEach(async (sync) => {
    if ((sync as any).integrations.length === 0) {
      await connectDB.collection(synchronizationsCollection).deleteMany({ _id: (sync as any)._id })
    }    
  });

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
