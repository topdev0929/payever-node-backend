import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import {
  BusinessIntegrationSubModel,
  BusinessIntegrationSubSchema,
  BusinessIntegrationSubSchemaName,
  BusinessIntegrationSubService,
  BusinessSchema,
  BusinessSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
} from '..';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { IntegrationsFixture, IntegrationSubscriptionFixture } from '../../../test/unit/integrations.fixture';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('IntegrationSubscriptionService ', async () => {
  let sandbox: sinon.SinonSandbox;

  let integrationSubscriptionService: BusinessIntegrationSubService;

  let subscriptionModel: BusinessIntegrationSubModel;

  let subscriptionMock: sinon.SinonMock &
    mongoose.Model<BusinessIntegrationSubModel>;

  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let subscriptionFixture: IntegrationSubscriptionFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessIntegrationSubService,
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
          provide: getModelToken(BusinessIntegrationSubSchemaName),
          useValue: mongoose.model(
            BusinessIntegrationSubSchemaName,
            BusinessIntegrationSubSchema
          )
        }
      ]
    }).compile();

    integrationSubscriptionService = module.get<BusinessIntegrationSubService>(
      BusinessIntegrationSubService
    );

    subscriptionModel = module.get(
      getModelToken(BusinessIntegrationSubSchemaName)
    );

    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    subscriptionFixture = new IntegrationSubscriptionFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    subscriptionMock = sinon.mock(subscriptionModel) as sinon.SinonMock &
      mongoose.Model<BusinessIntegrationSubModel>;
  });

  afterEach(async () => {
    sandbox.restore();
    subscriptionMock.restore();
    sandbox = undefined;
  });

  describe('install', () => {
    it('subscription created', async () => {
      const integration = integrationFixture.simple('2', 'name');
      const business = businessFixture.simple('a');
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscription.id }, { installed: true }, { new: true })
        .resolves(subscription);
      subscriptionMock
        .expects('create')
        .withArgs({ integration: integration, installed: false })
        .resolves(subscription);

      const result = await integrationSubscriptionService.install(
        integration,
        business
      );

      expect(subscriptionMock.verify());
      expect(result).to.be.eq(subscription);
    });
  });

  describe('uninstall', () => {
    it('subscription created', async () => {
      const integration = integrationFixture.simple('2', 'name');
      const business = businessFixture.simple('a');
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscription.id }, { installed: false }, { new: true })
        .resolves(subscription);

      subscriptionMock
        .expects('create')
        .withArgs({ integration: integration, installed: false })
        .resolves(subscription);

      const result = await integrationSubscriptionService.uninstall(
        integration,
        business
      );

      expect(subscriptionMock.verify());
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

      const result = await integrationSubscriptionService.findOneById(
        subscription.id
      );

      expect(subscriptionMock.verify());
      expect(result).to.be.eq(subscription);
    });
  });

  describe('findByBusinessAndCategory', () => {
    it('ok', async () => {
      const category = 'cat';
      const subscription1 = subscriptionFixture.simple('33');
      const integration1 = integrationFixture.simple('2', 'ba', category);
      subscription1.integration = integration1;

      const subscription2 = subscriptionFixture.simple('22');
      const integration2 = integrationFixture.simple('2', 'ab', category);
      subscription2.integration = integration2;

      const subscription3 = subscriptionFixture.simple('11');
      const integration3 = integrationFixture.simple('23', '23');
      subscription3.integration = integration3;

      const business = businessFixture.simple('a');
      business.integrationSubscriptions.push(subscription1);
      business.integrationSubscriptions.push(subscription2);
      business.integrationSubscriptions.push(subscription3);

      const result = await integrationSubscriptionService.findByCategory(
        business,
        category
      );

      expect(result.length).to.be.eq(2);
      expect(result[0]).to.be.eq(subscription2);
      expect(result[1]).to.be.eq(subscription1);
    });
  });

  describe('enable', () => {
    it('ok', async () => {
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscription.id }, { enabled: true }, { new: true })
        .resolves();

      const result = await integrationSubscriptionService.enable(subscription);

      expect(subscriptionMock.verify());
    });
  });

  describe('disable', () => {
    it('ok', async () => {
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('findOneAndUpdate')
        .withArgs({ _id: subscription.id }, { enabled: false }, { new: true })
        .resolves();

      const result = await integrationSubscriptionService.disable(subscription);

      expect(subscriptionMock.verify());
    });
  });

  describe('deleteOneById', () => {
    it('ok', async () => {
      const subscription = subscriptionFixture.simple('33');

      subscriptionMock
        .expects('deleteOne')
        .withArgs({ _id: subscription.id })
        .resolves();

      await integrationSubscriptionService.deleteOneById(subscription.id);

      expect(subscriptionMock.verify());
    });
  });
});
