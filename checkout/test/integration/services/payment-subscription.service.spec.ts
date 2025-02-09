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
  BusinessIntegrationSubSchema,
  BusinessIntegrationSubSchemaName,
  BusinessIntegrationSubService,
  IntegrationNameEnum,
  PaymentSubscriptionService,
} from '..';
import { IntegrationsFixture, IntegrationSubscriptionFixture } from '../../../test/unit/integrations.fixture';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('PaymentSubscriptionService ', async () => {
  let sandbox: sinon.SinonSandbox;

  let paymentSubscriptionService: PaymentSubscriptionService;
  let integrationService: BusinessIntegrationSubService;
  let integrationMock: sinon.SinonMock;

  let subscriptionFixture: IntegrationSubscriptionFixture;
  let integrationFixture: IntegrationsFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessIntegrationSubService,
        PaymentSubscriptionService,
        {
          provide: getModelToken(BusinessIntegrationSubSchemaName),
          useValue: mongoose.model(
            BusinessIntegrationSubSchemaName,
            BusinessIntegrationSubSchema
          )
        }
      ]
    }).compile();

    integrationService = module.get<BusinessIntegrationSubService>(BusinessIntegrationSubService);
    paymentSubscriptionService = module.get<PaymentSubscriptionService>(PaymentSubscriptionService);

    subscriptionFixture = new IntegrationSubscriptionFixture();
    integrationFixture = new IntegrationsFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    integrationMock = sinon.mock(integrationService) as sinon.SinonMock ;
  });

  afterEach(async () => {
    sandbox.restore();
    integrationMock.restore();
    sandbox = undefined;
  });

  describe('process', () => {
    it('enable', async () => {
      const model = subscriptionFixture.simple('id' );
      model.integration = integrationFixture.simple('id',IntegrationNameEnum.Cash);

      integrationMock
        .expects('enable')
        .withArgs(model)
        .resolves();

      const result = await paymentSubscriptionService.process(model);

      expect(integrationMock.verify());
    });

    it('do not enable', async () => {
      const model = subscriptionFixture.simple('id');
      model.integration = integrationFixture.simple('id', 'test name');

      integrationMock
        .expects('enable')
        .never();

      const result = await paymentSubscriptionService.process(model);

      expect(integrationMock.verify());
    });
  });});
