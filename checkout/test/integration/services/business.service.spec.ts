import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NestEventEmitter } from '@pe/nest-kit';
import { NEST_EVENT_EMITTER } from '@pe/nest-kit/modules/event-emitter/constants';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import {
  BusinessEvent,
  BusinessIntegrationSubSchema,
  BusinessIntegrationSubSchemaName,
  BusinessIntegrationSubService,
  BusinessModel,
  BusinessSchema,
  BusinessSchemaName,
  BusinessService,
  CheckoutSchema,
  CheckoutSchemaName,
  CreateBusinessDto,
  CurrencyExchangeService,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationService,
  UpdateBusinessDto,
} from '..';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { IntegrationsFixture, IntegrationSubscriptionFixture } from '../../../test/unit/integrations.fixture';
import { CurrencySchema, CurrencySchemaName } from '../schemas/currency.schema';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('BusinessService ', async () => {
  let sandbox: sinon.SinonSandbox;

  let businessService: BusinessService;
  let integrationSubscriptionService: BusinessIntegrationSubService;
  let integrationService: IntegrationService;

  let businessModel: BusinessModel;

  let businessMock: sinon.SinonMock;
  let integrationMock: sinon.SinonMock;
  let emitter: NestEventEmitter;

  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let subscriptionFixture: IntegrationSubscriptionFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        IntegrationService,
        BusinessIntegrationSubService,
        BusinessService,
        CurrencyExchangeService,
        {
          provide: NEST_EVENT_EMITTER,
          useValue: {
            emit: (): void => {},
          },
        },
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
          useValue: mongoose.model(BusinessIntegrationSubSchemaName, BusinessIntegrationSubSchema),
        },
        {
          provide: getModelToken(CurrencySchemaName),
          useValue: mongoose.model(CurrencySchemaName, CurrencySchema),
        },
      ],
    }).compile();

    businessService = module.get<BusinessService>(BusinessService);
    integrationSubscriptionService = module.get<BusinessIntegrationSubService>(BusinessIntegrationSubService);
    businessModel = module.get(getModelToken(BusinessSchemaName));
    integrationService = module.get<IntegrationService>(IntegrationService);


    emitter = module.get<NestEventEmitter>(NEST_EVENT_EMITTER);

    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    subscriptionFixture = new IntegrationSubscriptionFixture();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    businessMock = sinon.mock(businessModel) as sinon.SinonMock;
    integrationMock = sinon.mock(integrationSubscriptionService) as sinon.SinonMock;
  });

  afterEach(async () => {
    sandbox.restore();
    businessMock.restore();
    integrationMock.restore();
    sandbox = undefined;
  });

  describe('create', () => {
    it('ok', async () => {
      const dto = {
        _id : '1',
        name: 'testname'
      } as CreateBusinessDto;

      const business = businessFixture.simple('2');
      const integration1 = integrationFixture.simple('1', 'ba', 'channels');
      const integration2 = integrationFixture.simple('2', 'ba','channels');

      businessMock
        .expects('findOne')
        .withArgs({ _id: dto._id })
        .resolves(business);
      businessMock
        .expects('create')
        .withArgs()
        .resolves();

      sandbox.stub(emitter, 'emit').resolves();
      sandbox.stub(integrationSubscriptionService, 'install').resolves();
      sandbox.stub(integrationService, 'findByBusinessAndCategory').resolves([integration1, integration2]);

      const result = await businessService.create(dto);

      expect(businessMock.verify());
      expect(integrationMock.verify());
      expect(result).to.be.eq(business);
      expect(emitter.emit).to.have.been.calledOnceWith(BusinessEvent.BusinessCreated);
    });
  });

  describe('findOneById', () => {
    it('ok', async () => {
      const id = '2';

      const businessModel = businessFixture.simple(id);
      businessMock
        .expects('findOne')
        .withArgs({ _id: id })
        .resolves(businessModel);

      const result = await businessService.findOneById(id);

      expect(businessMock.verify());
      expect(result).to.be.eq(businessModel);
    });
  });

  describe('deleteOneById', () => {
    it('ok', async () => {
      const id = 'id';

      const businessModel = businessFixture.simple(id);
      const integrationId1 = '1';
      const subscriptionModel1 = subscriptionFixture.simple(integrationId1);
      const integrationId2 = '2';
      const subscriptionModel2 = subscriptionFixture.simple(integrationId2);
      businessModel.integrationSubscriptions.push(subscriptionModel1);
      businessModel.integrationSubscriptions.push(subscriptionModel2);

      businessMock
        .expects('findById')
        .withArgs(id)
        .resolves(businessModel);
      businessMock
        .expects('deleteOne')
        .withArgs({ _id: id })
        .resolves(businessModel);
      integrationMock
        .expects('deleteOneById')
        .withArgs(integrationId1)
        .resolves();
      integrationMock
        .expects('deleteOneById')
        .withArgs(integrationId2)
        .resolves();
      sandbox.stub(emitter, 'emit').resolves();

      await businessService.deleteOneById(id);

      expect(businessMock.verify());
      expect(emitter.emit).to.have.been.calledOnceWith(BusinessEvent.BusinessRemoved);
    });
  });

  describe('updateById', () => {
    it('ok', async () => {

      const data = {
        name : 'update'
      }  as UpdateBusinessDto;

      const id = 'id1';

      businessMock
        .expects('update')
        .withArgs({ _id: id }, { $set: data })
        .resolves(businessModel);

      await businessService.updateById(id, data);
      expect(businessMock.verify());
    });
  });
});
