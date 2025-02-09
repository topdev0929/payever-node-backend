import { PePact } from '@pe/pact-kit';
import { Logger } from '@nestjs/common';
import { ApplicationModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

PePact.publish(ApplicationModule, PactConfigOptionsService).catch((e: any) => {
  Logger.error(e);
  process.exit(1);
});
