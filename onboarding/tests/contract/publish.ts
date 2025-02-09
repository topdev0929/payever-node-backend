import { PePact } from '@pe/pact-kit';

import { ApplicationModule } from '../../src/app.module';
import { PactConsumerConfigOptionsService } from './pact-consumer-config-options.service';

PePact.publish(ApplicationModule, PactConsumerConfigOptionsService).catch((e: any) => {
  // tslint:disable-next-line: no-console
  console.error(e);
  process.exit(1);
});
