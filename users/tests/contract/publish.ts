import { PePact } from '@pe/pact-kit';

import { AppModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(AppModule, PactConfigOptionsService).catch((e: any) => {
  /* eslint no-console: 0 */
  console.error(e);
  process.exit(1);
});
