import artillery from '@pe/artillery-kit';
import { nestLaunch } from '@pe/nest-kit';
import * as constants from './constants';

nestLaunch(async () => {
  await artillery.run(constants.CONFIG);
});

