import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { CheckoutIntegrationSubscriptionService, CheckoutRabbitmqService, CheckoutService, ValidationService } from '.';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { CheckoutFixture } from '../../../test/unit/checkouts.fixture';
import { IntegrationsFixture, IntegrationSubscriptionFixture } from '../../../test/unit/integrations.fixture';
import {
  BusinessSchema,
  BusinessSchemaName,
  BusinessService,
  CheckoutModel,
  CheckoutSchema,
  CheckoutSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
  IntegrationSubscriptionService,
} from '../../integration';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('CheckoutIntegrationSubscriptionService ', async () => {
  let sandbox: sinon.SinonSandbox;
  let validationService: ValidationService;
  let businessService: BusinessService;
  let checkoutService: CheckoutService;
  let checkoutRabbitMqService: CheckoutRabbitmqService;
  let subscriptionService: CheckoutIntegrationSubscriptionService;
  let businessIntegrationService: IntegrationSubscriptionService;
  let checkoutModel: CheckoutModel;
  let subscriptionModel: IntegrationSubscriptionModel;

  let checkoutRabbitMqMock: sinon.SinonMock ;
  let checkoutMock: sinon.SinonMock & mongoose.Model<CheckoutModel>;
  let subscriptionMock: sinon.SinonMock & mongoose.Model<IntegrationSubscriptionModel>;

  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let checkoutFixture: CheckoutFixture;
  let subscriptionFixture: IntegrationSubscriptionFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        IntegrationSubscriptionService,
        CheckoutIntegrationSubscriptionService,

        {
          provide: CheckoutService,
          useValue: {
            findOneById: () => { }
          }
        },
        {
          provide: BusinessService,
          useValue: {
            findOneById: () => { }
          }
        },
        {
          provide: CheckoutRabbitmqService,
          useValue: {
            checkoutIntegrationEnabled: () => { },
            checkoutIntegrationDisabled: () => { }
          }
        },
        {
          provide: getModelToken(CheckoutSchemaName),
          useValue: mongoose.model(CheckoutSchemaName, CheckoutSchema)
        },
        {
          provide: getModelToken(BusinessSchemaName),
          useValue: mongoose.model(BusinessSchemaName, BusinessSchema)
        },
        {
          provide: getModelToken(IntegrationSchemaName),
          useValue: mongoose.model(IntegrationSchemaName, IntegrationSchema)
        },
        {
          provide: getModelToken(IntegrationSubscriptionSchemaName),
          useValue: mongoose.model(IntegrationSubscriptionSchemaName, IntegrationSubscriptionSchema)
        }
      ]
    }).compile();

    businessIntegrationService = module.get<IntegrationSubscriptionService>(IntegrationSubscriptionService);
    businessService = module.get<BusinessService>(BusinessService);
    checkoutService = module.get<CheckoutService>(CheckoutService);
    checkoutRabbitMqService = module.get<CheckoutRabbitmqService>(CheckoutRabbitmqService);

    checkoutModel = module.get(getModelToken(CheckoutSchemaName));
    subscriptionModel = module.get(getModelToken(IntegrationSubscriptionSchemaName));

    validationService = new ValidationService(
      module.get(getModelToken(CheckoutSchemaName)),
      checkoutService,
      businessService
    );

    subscriptionService = module.get<CheckoutIntegrationSubscriptionService>(CheckoutIntegrationSubscriptionService);

    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    checkoutFixture = new CheckoutFixture();
    subscriptionFixture = new IntegrationSubscriptionFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    checkoutRabbitMqMock = sinon.mock(checkoutRabbitMqService) as sinon.SinonMock;

    checkoutMock = sinon.mock(checkoutModel) as sinon.SinonMock & mongoose.Model<CheckoutModel>;
    subscriptionMock = sinon.mock(subscriptionModel) as sinon.SinonMock & mongoose.Model<IntegrationSubscriptionModel>;
  });

  afterEach(async () => {
    sandbox.restore();
    checkoutMock.restore();
    subscriptionMock.restore();
    checkoutRabbitMqMock.restore();
    sandbox = undefined;
  });

  describe('install', () => {
    it('subscription created', async () => {

      const integration = integrationFixture.simple('2', 'name');
      const checkout = checkoutFixture.simple('a');
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscription.id }, { installed: true }, { new: true })
        .resolves(subscription);

      subscriptionMock
        .expects('create')
        .withArgs({ integration: integration, installed : false})
        .resolves(subscription);

      checkoutRabbitMqMock
        .expects('checkoutIntegrationEnabled')
        .withArgs(integration, checkout)
        .resolves();

      const result = await subscriptionService.install(integration, checkout);

      expect(subscriptionMock.verify());
      expect(checkoutRabbitMqMock.verify());
      expect(result).to.be.eq(subscription);
    });
  });

  describe('uninstall', () => {
    it('subscription created', async () => {

      const integration = integrationFixture.simple('2', 'name');
      const checkout = checkoutFixture.simple('a');
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscription.id }, { installed: false }, { new: true })
        .resolves(subscription);

      subscriptionMock
        .expects('create')
        .withArgs({ integration: integration, installed : false})
        .resolves(subscription);

        checkoutRabbitMqMock
          .expects('checkoutIntegrationDisabled')
          .withArgs(integration, checkout)
          .resolves();

      const result = await subscriptionService.uninstall(integration, checkout);

      expect(subscriptionMock.verify());
      expect(checkoutRabbitMqMock.verify());
      expect(result).to.be.eq(subscription);
    });
  });

  describe('findOneById', () => {
    it('ok', async () => {
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findById')
        .withArgs(subscription.id)
        .resolves(subscription);

      const result = await subscriptionService.findOneById(subscription.id);

      expect(subscriptionMock.verify());
      expect(result).to.be.eq(subscription);
    });
  });

  describe('setOptions', () => {
    it('ok', async () => {
      const integration = integrationFixture.simple('2', 'name');
      const checkout = checkoutFixture.simple('a');
      const subscription = subscriptionFixture.simple('33');
      const options = {name:'name'};
      checkout.subscriptions.push(subscription);

      subscriptionMock
        .expects('updateOne')
        .withArgs(
          { _id: subscription.id },
          { options: options },
          { new: true },)
        .resolves();

      await subscriptionService.setOptions(integration, checkout, options);

      expect(subscriptionMock.verify());
    });
  });

  describe('getOptions', () => {
    it('ok', async () => {
      const integration = integrationFixture.simple('2', 'name');
      const subscription = subscriptionFixture.simple('33');
      subscription.options = {name:'name'};
      const checkout = checkoutFixture.simple('a');
      checkout.subscriptions.push(subscription);

      const result = await subscriptionService.getOptions(integration, checkout);

      expect(result).to.be.eq(subscription.options);
    });
  });

  describe('deleteOneById', () => {
    it('ok', async () => {
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('deleteOne')
        .withArgs(
          { _id: subscription.id })
        .resolves();

      await subscriptionService.deleteOneById(subscription.id);

      expect(subscriptionMock.verify());
    });
  });

  describe('findByBusiness', () => {
    it('ok', async () => {
      const subscription1 = subscriptionFixture.simple('11');
      const subscription2 = subscriptionFixture.simple('22');
      const subscription3 = subscriptionFixture.simple('33');
      const checkout = checkoutFixture.simple('a');
      checkout.subscriptions.push(subscription1);
      checkout.subscriptions.push(subscription2);
      checkout.subscriptions.push(subscription3);

      const result = await subscriptionService.getAllSubscriptions(checkout);

      expect(result).to.be.eq(checkout.subscriptions);
    });

  describe('getEnabledSubscriptions', () => {
    it('ok', async () => {
      const integration = integrationFixture.simple('2', 'name', 'shippings');
      const subscription1 = subscriptionFixture.simple('11');
      subscription1.integration = integration;

      const integration2 = integrationFixture.simple('3', 'name2');
      const subscription2 = subscriptionFixture.simple('22');
      subscription2.integration = integration2;
      subscription2.enabled = true;
      subscription2.installed = true;

      const integration3 = integrationFixture.simple('4', 'name3');
      const subscription3 = subscriptionFixture.simple('33');
      subscription3.integration = integration3;

      const checkout = checkoutFixture.simple('a');
      checkout.subscriptions.push(subscription2);
      checkout.subscriptions.push(subscription3);

      sandbox.stub(businessIntegrationService, 'findByBusiness').resolves([subscription1,subscription2,subscription3]);

      const result = await subscriptionService.getEnabledSubscriptions(checkout,
        businessFixture.simple('1'));

      expect(result[0]).to.be.eq(subscription2);
      expect(result[1]).to.be.eq(subscription1);
    });
  });

});
});
