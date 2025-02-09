import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  asyncProviderChecker, PactAsyncMessagesCollector, PactBootstrap,
} from '@pe/pact-kit';
import 'mocha';
import './config/bootstrap';

let app: NestFastifyApplication;
let messagesProviders: any;

describe('Pact Verification', () => {
  before(async () => {
    app = await PactBootstrap.bootstrap();

    messagesProviders = await app.get(PactAsyncMessagesCollector).getMessageProviders();
  });

  it(
    `should validate the expectations of rabbit consumers for messages`,
    (done: (err?: any) => void) => {
      asyncProviderChecker(done, messagesProviders);
    },
  );

  after(async () => { await app.close() })
});
