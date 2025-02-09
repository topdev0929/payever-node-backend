import { onboardings } from '../fixtures/onboardings.fixture';
import { OnboardingDto } from '../src/onboarding/dto';
import { MongoClient, Db } from 'mongodb';

const onboardingCollection: string = 'onboardings';
const newOnboardingName: string = 'industry';

async function up(db: any): Promise<any> {
  const client: MongoClient = new MongoClient(
    db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true },
  );
  await client.connect();
  const connectDB: Db = await client.db();

  const newOnboarding: OnboardingDto =
    onboardings.find((item: OnboardingDto) => item.name === newOnboardingName);

  if (newOnboarding) {
    await connectDB.collection(onboardingCollection).findOneAndUpdate(
      { _id: newOnboarding._id},
      { $set: newOnboarding},
      { upsert: true},
    );
  }

  await client.close();
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
