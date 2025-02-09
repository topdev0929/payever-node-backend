import { onboardings } from '../fixtures/onboardings.fixture';
import { OnboardingDto } from '../src/onboarding/dto';
import { MongoClient, Db } from 'mongodb';

const onboardingCollection: string = 'onboardings';

async function up(db: any): Promise<any> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  for (const onboarding of onboardings) {
    await connectDB.collection(onboardingCollection).findOneAndUpdate(
      {
        _id: onboarding._id,
      },
      {
        $set: {
          form: onboarding.form,
        },
      },
    );
  }

  await client.close();
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
