import 'mocha';
import { INestApplication } from '@nestjs/common';
import { PactVerifierService } from 'nestjs-pact';
import { PePact } from '@pe/pact-kit';

import { redisOverrider } from '@pe/pact-kit/modules/mocks/redis.mock';
import { HttpAppModule } from '../../src/httpapp.module';
import { PactConfigOptionsService } from './pact-config-options.service';


describe('Pact Verification', function(): void {
  if (process.env.DEBUG) { this.timeout(60 * 1000); }
  let app: INestApplication;
  let verifier: PactVerifierService;
  before(async () => {
    [app, verifier] = await PePact.getProvider(HttpAppModule, PactConfigOptionsService, { });    
  });

  it(`should validate the expectations`, () => verifier.verify(app));

  after(() => app.close());
});
