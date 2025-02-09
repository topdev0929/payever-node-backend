import 'mocha';
import { PactVerifierService } from 'nestjs-pact';
import { INestApplication } from '@nestjs/common';
import { PePact } from '@pe/pact-kit';
import { redisOverrider } from '@pe/pact-kit/modules/mocks/redis.mock';

import { ApplicationModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

describe('Pact Verification', function(): void {
  if (process.env.DEBUG) { this.timeout(60 * 1000); }
  let app: INestApplication;
  let verifier: PactVerifierService;
  before(async () => {
    [app, verifier] = await PePact.getProvider(
      ApplicationModule,
      PactConfigOptionsService,
      {
        globalPrefix: '/api',
      },
      {
        overriders: [redisOverrider],
      },
    );
  });

  it(`should validate the expectations of all consumers for messages`, () => verifier.verify(app));

  after(() => app.close());
});
