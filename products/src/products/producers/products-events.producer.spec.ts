import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Test } from '@nestjs/testing';
import { RabbitMqClient } from '@pe/nest-kit';
import { ProductsEventsProducer } from '../../../src/products/producers';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../../src/products/models';

chai.use(sinonChai);
const expect = chai.expect;

const EXCHANGE = 'async_events';

describe('ProductsEventProducer', () => {
  let sandbox: sinon.SinonSandbox;
  let productsEventsProducer: ProductsEventsProducer;
  let rabbitMqClient: RabbitMqClient;

  before(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductsEventsProducer],
      providers: [
        {
          provide: RabbitMqClient,
          useValue: {
            send: () => {},
          },
        },
      ],
    }).compile();

    rabbitMqClient = module.get<RabbitMqClient>(RabbitMqClient);
    productsEventsProducer = module.get<ProductsEventsProducer>(ProductsEventsProducer);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(rabbitMqClient, 'send').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('productCreated', () => {
    it('should trigger product created event', async () => {
      const eventName = 'products.event.product.created';
      const productMock = {};
      const productModel = {
        toObject: () => {
          return productMock;
        },
      } as PopulatedVariantsCategoryCollectionsChannelSetProductModel;

      sandbox.spy(productModel, 'toObject');

      await productsEventsProducer.productCreated(productModel);

      expect(rabbitMqClient.send).to.have.been.calledWithMatch(
        {
          exchange: EXCHANGE,
          channel: eventName,
        },
        {
          name: eventName,
          payload: productMock,
        },
      );

      expect(productModel.toObject).to.have.been.calledOnce;
    });
  });

  describe('productUpdated', () => {
    it('should trigger product updated event', async () => {
      const eventName = 'products.event.product.updated';
      const productMock = {};
      const productModel = {
        toObject: () => {
          return productMock;
        },
      } as ProductModel;

      sandbox.spy(productModel, 'toObject');

      await productsEventsProducer.productUpdated(productModel, productModel);

      expect(rabbitMqClient.send).to.have.been.calledWithMatch(
        {
          exchange: EXCHANGE,
          channel: eventName,
        },
        {
          name: eventName,
          payload: productMock,
        },
      );

      expect(productModel.toObject).to.have.been.calledOnce;
    });
  });

  describe('productRemoved', () => {
    it('should trigger product removed event', async () => {
      const productMock = {};
      const productModel = {
        toObject: () => {
          return productMock;
        },
      } as ProductModel;

      const eventName = 'products.event.product.removed';
      await productsEventsProducer.productRemoved(productModel);

      expect(rabbitMqClient.send).to.have.been.calledWithMatch(
        {
          channel: eventName,
          exchange: EXCHANGE,
        },
        {
          name: eventName,
          payload: productModel.toObject(),
        },
      );
    });
  });
});
