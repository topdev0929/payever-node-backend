import artillery from '@pe/artillery-kit';
import * as constants from './constants';

(async () => {
  // tslint:disable: await-promise
  // tslint:disable: no-use-of-empty-return-value
  await artillery.run(constants.CONFIG);
})().catch();

