import 'mocha';
import { INestApplication } from '@nestjs/common';
import { PactVerifierService } from 'nestjs-pact';
import { PePact } from '@pe/pact-kit';

import { PactConfigOptionsService } from './pact-config-options.service';

import { ApplicationModule } from '../../src/app.module';

describe('Pact Verification', function(): void {
  this.timeout(60 * 60 * 1000);
  let app: INestApplication;
  let verifier: PactVerifierService;
  before(async () => {
    [app, verifier] = await PePact.getProvider(ApplicationModule, PactConfigOptionsService, {
      globalPrefix: '/api',
    });
  });

  it(`should validate the expectations`, () => verifier.verify(app));

  after(() => app.close());
});
