import 'mocha';
import { PactVerifierService } from 'nestjs-pact';
import multipart from '@fastify/multipart';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { PePact } from '@pe/pact-kit';

import { ApplicationModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';

describe('Pact Verification', function (): void {
  if (process.env.DEBUG) { this.timeout(60 * 1000); }
  let app: NestFastifyApplication;
  let verifier: PactVerifierService;
  before(async () => {

    [app, verifier] = await PePact.getProvider(
      ApplicationModule,
      PactConfigOptionsService, {
      globalPrefix: '/api',
    },
      {
        overriders: [],
      },
    ) as [NestFastifyApplication, PactVerifierService];

    await app.register(multipart);
  });

  it(`should validate the expectations`, () => verifier.verify(app));

  after(() => app.close());
});
