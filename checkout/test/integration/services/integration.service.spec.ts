import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Logger } from 'mongodb';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import {
  BusinessIntegrationSubModel,
  BusinessIntegrationSubSchema,
  BusinessIntegrationSubSchemaName,
  BusinessSchema,
  BusinessSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  CreateIntegrationDto,
  CurrencyExchangeService,
  IntegrationModel,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationService,
} from '..';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { IntegrationsFixture, IntegrationSubscriptionFixture } from '../../../test/unit/integrations.fixture';
import { CurrencySchema, CurrencySchemaName } from '../schemas/currency.schema';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('IntegrationService ', async () => {
  let sandbox: sinon.SinonSandbox;

  let integrationService: IntegrationService;

  let integrationModel: IntegrationModel;

  let subscriptionMock: sinon.SinonMock &
    mongoose.Model<BusinessIntegrationSubModel>;

  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let subscriptionFixture: IntegrationSubscriptionFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationService,
        Logger,
        CurrencyExchangeService,
        {
          provide: getModelToken(CheckoutSchemaName),
          useValue: mongoose.model(CheckoutSchemaName, CheckoutSchema),
        },
        {
          provide: getModelToken(BusinessSchemaName),
          useValue: mongoose.model(BusinessSchemaName, BusinessSchema),
        },
        {
          provide: getModelToken(IntegrationSchemaName),
          useValue: mongoose.model(IntegrationSchemaName, IntegrationSchema),
        },
        {
          provide: getModelToken(BusinessIntegrationSubSchemaName),
          useValue: mongoose.model(
            BusinessIntegrationSubSchemaName,
            BusinessIntegrationSubSchema,
          ),
        },
        {
          provide: getModelToken(CurrencySchemaName),
          useValue: mongoose.model(CurrencySchemaName, CurrencySchema),
        },
      ],
    }).compile();

    integrationService = module.get<IntegrationService>(IntegrationService);
    integrationModel = module.get(getModelToken(IntegrationSchemaName));

    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    subscriptionFixture = new IntegrationSubscriptionFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    subscriptionMock = sinon.mock(integrationModel) as sinon.SinonMock &
      mongoose.Model<IntegrationModel>;
  });

  afterEach(async () => {
    sandbox.restore();
    subscriptionMock.restore();
    sandbox = undefined;
  });

  describe('findByBusinessAndCategory', () => {
    it('ok', async () => {
      const category = 'cat';

      const integration1 = integrationFixture.simple('2', 'ba', category);
      const integration2 = integrationFixture.simple('2', 'ab', category);
      const integration3 = integrationFixture.simple('23', '23');

      subscriptionMock
        .expects('find')
        .withArgs({ category: category })
        .resolves([integration1,integration2]);

      const result = await integrationService.findByCategory(category);

      expect(result.length).to.be.eq(2);
      expect(result[0]).to.be.eq(integration2);
      expect(result[1]).to.be.eq(integration1);
    });
  });

  describe('findOneById', () => {
    it('ok', async () => {
      const integration1 = integrationFixture.simple('2', 'name test');

      subscriptionMock
        .expects('findOne')
        .withArgs({ _id: integration1.id })
        .resolves(integration1);

      const result = await integrationService.findOneById(integration1.id);

      expect(subscriptionMock.verify());
      expect(result).to.be.eq(integration1);
    });
  });

  describe('findOneByName', () => {
    it('ok', async () => {
      const integration1 = integrationFixture.simple('2', 'ba');

      subscriptionMock
        .expects('findOne')
        .withArgs({ name: integration1.name })
        .resolves(integration1);

      const result = await integrationService.findOneByName(integration1.name);

      expect(subscriptionMock.verify());
      expect(result).to.be.eq(integration1);
    });
  });

  describe('findOneByNameAndCategory', () => {
    it('ok', async () => {
      const integration = integrationFixture.simple('2', 'ba', 'category');

      subscriptionMock
        .expects('findOne')
        .withArgs({ name: integration.name, category: integration.category })
        .resolves(integration);

      const result = await integrationService.findOneByNameAndCategory(integration.name,integration.category);

      expect(subscriptionMock.verify());
      expect(result).to.be.eq(integration);
    });
  });

  describe('create', () => {
    it('ok', async () => {
      const dto = {
        name: 'name test',
        category: 'category test'
      } as CreateIntegrationDto;

      subscriptionMock
        .expects('create')
        .withArgs(dto)
        .resolves();

      const result = await integrationService.create(dto);

      expect(subscriptionMock.verify());
    });
  });

});
