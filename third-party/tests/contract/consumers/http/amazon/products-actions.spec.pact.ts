import { HttpModule } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Pact } from '@pact-foundation/pact';
import { PactBootstrap } from '@pe/pact-kit';
import { BusinessModel } from '../../../../../src/business/models';
import { IntegrationModel, IntegrationApiService } from '@pe/third-party-sdk';
import { pactConfiguration, ProvidersEnum } from '../../../config';
import '../../../config/bootstrap';
import { amazonThirdPartyStub } from '../../../stubs';
import { ProductsInteractions } from './interactions';

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

  describe('should send synchronize product request', () => {
    before((done) => {
      provider.addInteraction(
        ProductsInteractions.getSyncProductsInteraction(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'sync-products',
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send update product request with full product data', () => {
    before((done) => {
      provider.addInteraction(
        ProductsInteractions.getUpdateProductInteractionFullProductDataWithVariants(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'update-product',
        {
          barcode: 'test_barcode',
          categories: [{ name: 'Category name' }],
          currency: 'EUR',
          description: 'Test description',
          images: ['image1.png'],
          price: 100,
          enabled: true,
          salePrice: 10,
          shipping: {
            weight: 10,
            width: 1,
            length: 2,
            height: 3,
            measure_mass: 'kg',
            measure_size: 'cm',
          },
          sku: 'test_sku',
          title: 'Some Title',
          type: 'physical',
          variants: [{
            images: ['var_image.png'],
            title: 'Test Variant Title',
            description: 'Some variant description',
            hidden: false,
            price: 10,
            salePrice: 15,
            shipping: {
              weight: 10,
              width: 1,
              length: 2,
              height: 3,
              measure_mass: 'kg',
              measure_size: 'cm',
            },
            sku: 'variant_sku',
            barcode: 'barcode',
          }],
        },
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send update product request with minimal product data', () => {
    before((done) => {
      provider.addInteraction(
        ProductsInteractions.getUpdateProductInteractionMinimalProductData(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'update-product',
        {
          price: 100,
          sku: 'test_sku',
          title: 'Some Title',
        },
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send create product request with full product data', () => {
    before((done) => {
      provider.addInteraction(
        ProductsInteractions.getCreateProductInteractionFullProductDataWithVariants(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'create-product',
        {
          barcode: 'test_barcode',
          categories: [{ name: 'Category name' }],
          currency: 'EUR',
          description: 'Test description',
          images: ['image1.png'],
          price: 100,
          enabled: true,
          salePrice: 10,
          shipping: {
            weight: 10,
            width: 1,
            length: 2,
            height: 3,
            measure_mass: 'kg',
            measure_size: 'cm',
          },
          sku: 'test_sku',
          title: 'Some Title',
          type: 'physical',
          variants: [{
            images: ['var_image.png'],
            title: 'Test Variant Title',
            description: 'Some variant description',
            hidden: false,
            price: 10,
            salePrice: 15,
            shipping: {
              weight: 10,
              width: 1,
              length: 2,
              height: 3,
              measure_mass: 'kg',
              measure_size: 'cm',
            },
            sku: 'variant_sku',
            barcode: 'barcode',
          }],
        },
      ).then((result: any) => {
        done();
      });
    });
  });

  describe('should send create product request with minimal product data', () => {
    before((done) => {
      provider.addInteraction(
        ProductsInteractions.getCreateProductInteractionMinimalProductData(),
      ).then(() => {
        done();
      });
    });

    it('execute', done => {
      const business: any = mockBusiness();

      apiService.executeAction(
        business as BusinessModel,
        amazonThirdPartyStub as IntegrationModel,
        'create-product',
        {
          price: 100,
          sku: 'test_sku',
          title: 'Some Title',
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
