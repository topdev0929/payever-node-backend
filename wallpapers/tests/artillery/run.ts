import artillery from '@pe/artillery-kit';
import { config } from './constants';

artillery.run(config).catch(console.error);
