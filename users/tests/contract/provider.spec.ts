import 'mocha';
import { PactVerifierService } from 'nestjs-pact';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { PePact } from '@pe/pact-kit';
import { AppModule } from '../../src/app.module';
import { PactConfigOptionsService } from './pact-config-options.service';
import { redisOverrider } from '@pe/pact-kit/modules/mocks/redis.mock';
import { elasticOverrider } from '@pe/pact-kit/modules/mocks/elastic.mock';
import { RabbitClientMock } from '@pe/pact-kit/modules/mocks/rabbit-client.mock';
import { TestingModuleBuilder } from '@nestjs/testing';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';

describe('Pact Verification', function(): void {
  if (process.env.DEBUG) { this.timeout(600 * 1000); }
  let app: INestApplication;
  let verifier: PactVerifierService;
  before(async () => {
    [app, verifier] = await PePact.getProvider(AppModule, PactConfigOptionsService, {
      globalPrefix: '/api',
      httpAdapter: {
        class: FastifyAdapter,
        options: { },
      },
    }, {
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
