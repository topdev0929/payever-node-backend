import artillery from '@pe/artillery-kit';
import * as constants from './constants';

(async () => {
  artillery.run(constants.CONFIG);
})().catch();

