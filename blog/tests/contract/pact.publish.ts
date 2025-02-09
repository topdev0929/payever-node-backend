import { PePact } from '@pe/pact-kit';

import { ApplicationModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(ApplicationModule, PactConfigOptionsService).catch((e: any) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
