import { HttpModule } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Pact } from '@pact-foundation/pact';
import { PactBootstrap } from '@pe/pact-kit';
import { BusinessModel } from '../../../../../src/business/models';
import { IntegrationModel, IntegrationApiService } from '@pe/third-party-sdk';
import { pactConfiguration, ProvidersEnum } from '../../../config';
import '../../../config/bootstrap';
import { amazonThirdPartyStub } from '../../../stubs';
import { InventoryInteractions } from './interactions';

const authorizationId: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const thirdPartyId: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

describe('Pact with amazon micro', () => {
  let provider: Pact;
  let app: NestFastifyApplication;
  let apiService: IntegrationApiService;

  before(async (): Promise<any> => {
    provider = new Pact({
      ...pactConfiguration.consumer,
      provider: ProvidersEnum.Amazon,
    });

    app = await PactBootstrap.bootstrap({
      importModules: [HttpModule],
      providers: [],
    });
    apiService = app.get<IntegrationApiService>(IntegrationApiService);

    await provider.setup();
  });

  after(async (): Promise<any> => {
    await provider.finalize();
    await app.close();
  });

  afterEach((): Promise<any> => provider.verify());

  describe('should send synchronize inventory request', () => {
    before((done) => {
      provider.addInteraction(
        InventoryInteractions.getSyncInventoryInteraction(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'sync-inventory',
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send add inventory request', () => {
    before((done) => {
      provider.addInteraction(
        InventoryInteractions.getAddInventoryInteraction(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'add-inventory',
        {
          sku: 'sku',
          stock: 20,
        },
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send subtract inventory request', () => {
    before((done) => {
      provider.addInteraction(
        InventoryInteractions.getSubtractInventoryInteraction(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'subtract-inventory',
        {
          sku: 'sku',
          stock: 20,
        },
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send set inventory request', () => {
    before((done) => {
      provider.addInteraction(
        InventoryInteractions.getSetInventoryInteraction(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'set-inventory',
        {
          sku: 'sku',
          stock: 20,
        },
      ).then((result: any) => {
        done();
      });
    });
  });

});

function mockBusiness(): any {
  return {
    populate: mockPopulate,
    subscriptions: [
      {
        thirdparty: thirdPartyId,
        externalId: authorizationId,
      },
    ],
  };
}

const mockPopulate: any = (): any => {
  return {
    execPopulate: (): void => {
      return null;
    },
    populate: mockPopulate,
  };
};
