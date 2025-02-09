import { PePact } from '@pe/pact-kit';

import { AppModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(AppModule, PactConfigOptionsService).catch((e: any) => {
  // tslint:disable-next-line: no-console
  console.error(e);
  process.exit(1);
});
