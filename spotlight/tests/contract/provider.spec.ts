import 'mocha';
import { INestApplication } from '@nestjs/common';
import { PactVerifierService } from 'nestjs-pact';
import { PePact } from '@pe/pact-kit';

import { redisOverrider } from '@pe/pact-kit/modules/mocks/redis.mock';
import { AppModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';
import { NestFastifyApplication } from '@nestjs/platform-fastify';


describe('Pact Verification', function (): void {
  if (process.env.DEBUG) { this.timeout(60 * 1000); }
  let app: NestFastifyApplication;
  let verifier: PactVerifierService;
  before(async () => {
    [app, verifier] = await PePact.getProvider(
      AppModule,
      PactConfigOptionsService, {
      globalPrefix: '/api',
    },
      {
        overriders: [redisOverrider],
      },
    ) as [NestFastifyApplication, PactVerifierService];
  });

  it(`should validate the expectations`, () => verifier.verify(app));

  after(() => app.close());
});
