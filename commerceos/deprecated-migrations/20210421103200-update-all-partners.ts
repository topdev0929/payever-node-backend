import { v4 as uuid } from 'uuid';
import { onboardings } from '../fixtures/onboardings.fixture';

const partnersCollection: string = 'partners';

async function up(db: any): Promise<any> {

  for (const partner of onboardings) {
    if (partner) {
      if (partner.afterLogin) {
        partner.afterLogin.forEach((x: any) => x._id = uuid());
      }
      if (partner.afterRegistration) {
        partner.afterRegistration.forEach((x: any) => x._id = uuid());
      }

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
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
