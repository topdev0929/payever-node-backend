import { BUSINESS_SUPPORT_CHANNEL } from '../fixtures/templates.fixture';

import { updateTemplates } from './tools/update-templates';

module.exports.up = async (db: any) => {
  await updateTemplates(db, [BUSINESS_SUPPORT_CHANNEL]);
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
