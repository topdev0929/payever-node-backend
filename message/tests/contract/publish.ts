import { PePact } from '@pe/pact-kit';

import { ConsumerAppModule } from '../../src/consumerapp.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(ConsumerAppModule, PactConfigOptionsService).catch((e: any) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
