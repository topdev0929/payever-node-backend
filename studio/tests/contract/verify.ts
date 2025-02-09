import 'mocha';
import './config/bootstrap';
import { NestFastifyApplication } from '@nestjs/platform-fastify-legacy';
import { apiProviderChecker, asyncProviderChecker, PactAsyncMessagesCollector, PactBootstrap } from '@pe/pact-kit';
import { pactConfiguration } from './config';

let app: NestFastifyApplication;
let messagesProviders: any;

describe('Pact Verification', () => {

  if (pactConfiguration.options.states && pactConfiguration.options.states.length > 0) {
    it(
      'should validate the expectations of all consumers',
      (done: (err?: any) => void) => {
        return apiProviderChecker(done);
      });
  }

  after(async () => { await app.close(); });
});
