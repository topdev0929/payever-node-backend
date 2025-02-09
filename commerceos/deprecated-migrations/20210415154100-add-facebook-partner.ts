import { v4 as uuid } from 'uuid';

import { onboardings } from '../fixtures/onboardings.fixture';
import { OnboardingDto } from '../src/onboarding/dto';

const partnersCollection: string = 'partners';

async function up(db: any): Promise<any> {

  const partner: OnboardingDto = onboardings.find( (value: OnboardingDto) => { return value.name === 'facebook'; } );
  if (partner) {
    partner.afterLogin.forEach((x: any) => x._id = uuid());
    partner.afterRegistration.forEach((x: any) => x._id = uuid());

    await db._run(
      'remove',
      partnersCollection,
      {
        $and: [
          { name: 'facebook'},
          { _id: { $ne: partner._id} },
        ],
      },
    );

    await db._run(
      'update',
      partnersCollection,
      {
        query: {
          _id: partner._id,
        },

        update: {
          ...partner,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        options: {
          upsert: true,
        },
      },
    );
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
