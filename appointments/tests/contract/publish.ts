import { PePact } from '@pe/pact-kit';
import { AppModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(AppModule, PactConfigOptionsService)
.then(() => {}).catch((_: any) => {
  // eslint-disable-next-line no-console
  process.exit(1);
});
