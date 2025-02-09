import artillery from '@pe/artillery-kit';
import { CONFIG } from './constants';

(async () => {
  await artillery.run(CONFIG);
})().catch();
