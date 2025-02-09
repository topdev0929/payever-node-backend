import { PePact } from '@pe/pact-kit';

// override the env app name
process.env.APP_NAME = `nodejs-backend-builder`;

import { ApplicationModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(ApplicationModule, PactConfigOptionsService).catch((e: any) => {
  /* eslint no-console: 0 */
  console.error(e);
  process.exit(1);
});
