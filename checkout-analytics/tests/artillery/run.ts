import artillery from '@pe/artillery-kit';
import * as constants from './constants';

(async () => {
  await artillery.run(constants.CONFIG);
})().catch();

