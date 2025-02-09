import { BUSINESS_SUPPORT_CHANNEL } from '../fixtures/templates.fixture';

import { updateTemplates } from './tools/update-templates';

module.exports.up = async (db: any) => {
  await updateTemplates(db, [BUSINESS_SUPPORT_CHANNEL]);
  await db._run(
    'updateMany',
    'chattemplates',
    {
      query: { type: { $exists: 0 } },
      update: { $set: { type: 'app-channel' } },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
