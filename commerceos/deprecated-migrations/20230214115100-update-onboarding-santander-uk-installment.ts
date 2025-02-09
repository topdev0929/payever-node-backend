import { onboardings } from '../fixtures/onboardings.fixture';
import { OnboardingDto } from '../src/onboarding/dto';
import { MongoClient, Db } from 'mongodb';

const onboardingCollection: string = 'onboardings';
const santanderUk: string = 'santander-gb-installment';

async function up(db: any): Promise<any> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const onboarding: OnboardingDto | undefined =
    onboardings.find((item: OnboardingDto) => item.name === santanderUk);

  if (onboarding) {
    await connectDB.collection(onboardingCollection).findOneAndUpdate(
      {
        _id: onboarding._id,
      },
      {
        $set: {
          ...onboarding,
        },
      },
      {
        upsert: true,
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
