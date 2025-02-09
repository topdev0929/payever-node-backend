import { PePact } from '@pe/pact-kit';
import { AppModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-consumer-config-options.service';

PePact.publish(AppModule, PactConfigOptionsService).catch((e: any) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
