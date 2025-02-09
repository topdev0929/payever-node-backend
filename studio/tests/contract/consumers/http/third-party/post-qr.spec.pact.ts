import 'mocha';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Pact } from '@pact-foundation/pact';
import { PactBootstrap } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../../../config';
import '../../../config/bootstrap';
import { environment } from '../../../../../src/environments';

describe('Pact with third-party micro', () => {
  let provider: Pact;
  let app: NestFastifyApplication;

  before(async () => {
    provider = new Pact({
      ...pactConfiguration.consumer,
      provider: ProvidersEnum.ThirdParty,
    });
    environment.urlPayeverApi = `http://localhost:${pactConfiguration.consumer.port}`;

    app = await PactBootstrap.bootstrap({});

    await provider.setup();
  });

  after(async () => {
    await provider.finalize();
    await app.close();
  });

  after(async () => {
    provider.verify();
  });

  describe('should send post studio code request', () => {
    beforeEach( () => {
    });

    it('execute', done => {
      done();
    });
  });
});
