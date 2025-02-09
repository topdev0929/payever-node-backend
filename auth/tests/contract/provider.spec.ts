import 'mocha';
import { INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { PactVerifierService } from 'nestjs-pact';
import { PePact } from '@pe/pact-kit';

import { redisOverrider } from '@pe/pact-kit/modules/mocks/redis.mock';
import { elasticOverrider } from '@pe/pact-kit/modules/mocks/elastic.mock';
import { RabbitClientMock } from '@pe/pact-kit/modules/mocks/rabbit-client.mock';
import { ApplicationModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';

describe('Pact Verification', function(): void {
  if (process.env.DEBUG) { this.timeout(60 * 1000); }
  let app: INestApplication;
  let verifier: PactVerifierService;
  before(async () => {
    [app, verifier] = await PePact.getProvider(ApplicationModule, PactConfigOptionsService, { }, {
      overriders: [redisOverrider, elasticOverrider, (builder: TestingModuleBuilder) => {
        builder
          .overrideProvider(RabbitMqClient)
          .useValue(new RabbitClientMock());
      }, (builder: TestingModuleBuilder) => {
        builder
          .overrideProvider(RabbitMqRPCClient)
          .useValue(new RabbitClientMock());
      }, ]
    });
  });

  it(`should validate the expectations`, () => verifier.verify(app));

  after(() => app.close());
});
