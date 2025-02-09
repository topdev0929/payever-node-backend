import artillery from '@pe/artillery-kit';
import * as constants from './constants';

(async () => {
 return artillery.run(constants.CONFIG);
})().catch();

