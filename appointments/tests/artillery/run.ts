import artillery from '@pe/artillery-kit';
import { CONFIG } from './constants';

artillery.run(CONFIG).catch(() => {});
