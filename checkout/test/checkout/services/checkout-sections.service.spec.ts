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
import {
  CheckoutIntegrationSubscriptionService,
  CheckoutRabbitmqService,
  CheckoutSectionsService,
  CheckoutService,
} from '.';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { CheckoutFixture } from '../../../test/unit/checkouts.fixture';
import {
  IntegrationsFixture,
  IntegrationSubscriptionFixture,
  SectionFixture,
} from '../../../test/unit/integrations.fixture';
import {
  BusinessSchema,
  BusinessSchemaName,
  BusinessService,
  CheckoutModel,
  CheckoutSchema,
  CheckoutSchemaName,
  CheckoutSectionModel,
  CheckoutSectionSchema,
  CheckoutSectionSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
  IntegrationSubscriptionService,
  SectionEnum,
  SectionModel,
} from '../../integration';
import { IntegrationCategoryEnum } from '../enums';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('CheckoutSectionsService ', async () => {
  let sandbox: sinon.SinonSandbox;
  let businessService: BusinessService;
  let checkoutService: CheckoutService;
  let checkoutSectionsService: CheckoutSectionsService;
  let businessIntegrationService: IntegrationSubscriptionService;
  let checkoutModel: CheckoutModel;
  let sectionModel: CheckoutSectionModel;

  let checkoutIntegrationSubscriptionService:CheckoutIntegrationSubscriptionService;

  let subscriptionModel: IntegrationSubscriptionModel;

  let checkoutMock: sinon.SinonMock & mongoose.Model<CheckoutModel>;
  let subscriptionMock: sinon.SinonMock & mongoose.Model<IntegrationSubscriptionModel>;
  let checkoutSectionMock: sinon.SinonMock & mongoose.Model<SectionModel>;


  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let checkoutFixture: CheckoutFixture;
  let subscriptionFixture: IntegrationSubscriptionFixture;
  let sectionFixture: SectionFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        IntegrationSubscriptionService,
        CheckoutSectionsService,
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
          provide: getModelToken(CheckoutSectionSchemaName),
          useValue: mongoose.model(CheckoutSectionSchemaName, CheckoutSectionSchema)
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
    checkoutIntegrationSubscriptionService  = module.get<CheckoutIntegrationSubscriptionService>(CheckoutIntegrationSubscriptionService);

    checkoutModel = module.get(getModelToken(CheckoutSchemaName));

    checkoutSectionsService = module.get<CheckoutSectionsService>(CheckoutSectionsService);

    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    checkoutFixture = new CheckoutFixture();
    sectionFixture = new SectionFixture();
    subscriptionFixture = new IntegrationSubscriptionFixture();
    sectionModel = module.get(getModelToken(CheckoutSectionSchemaName));

  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    checkoutMock = sinon.mock(checkoutModel) as sinon.SinonMock & mongoose.Model<CheckoutModel>;
    subscriptionMock = sinon.mock(subscriptionModel) as sinon.SinonMock & mongoose.Model<IntegrationSubscriptionModel>;
    checkoutSectionMock = sinon.mock(sectionModel) as sinon.SinonMock & mongoose.Model<SectionModel>;
  });

  afterEach(async () => {
    sandbox.restore();
    checkoutMock.restore();
    //subscriptionMock.restore();
    checkoutSectionMock.restore();
    sandbox = undefined;
  });

  describe('findAll', () => {
    it('ok', async () => {
      checkoutSectionMock
        .expects('find')
        .resolves();

      await checkoutSectionsService.getSections();

      expect(checkoutSectionMock.verify());
    });
  });


  describe('getDefaultSections', () => {
    it('ok', async () => {
      const section1 = sectionFixture.simple('1', SectionEnum.SendToDevice);

      checkoutSectionMock
        .expects('find')
        .resolves([section1]);

      const result =await checkoutSectionsService.getDefaultSections();

      expect(checkoutSectionMock.verify());
      expect(result.length).to.be.eq(1);
      expect(result[0].enabled).to.be.undefined;
      expect(result[0].order).to.be.undefined;
      expect(result[0].code).to.be.eq(SectionEnum.SendToDevice);
    });
  });

  describe('getAvailableSections', () => {
    it('Communication and settings', async () => {

      const section1 = sectionFixture.simple('1', SectionEnum.SendToDevice);
      const section2 = sectionFixture.simple('2');
      const section3 = sectionFixture.simple('3', SectionEnum.Shipping);

      const integration = integrationFixture.simple('2', 'name', IntegrationCategoryEnum.Communications);
      const subscription1 = subscriptionFixture.simple('11');
      subscription1.integration = integration;

      const integration2 = integrationFixture.simple('3', 'name2',IntegrationCategoryEnum.Shippings);
      const subscription2 = subscriptionFixture.simple('22');
      subscription2.integration = integration2;

      const integration3 = integrationFixture.simple('4', 'name3');
      const subscription3 = subscriptionFixture.simple('33');
      subscription3.integration = integration3;

      checkoutSectionMock
        .expects('find')
        .resolves([section1,section2,section3]);

      sandbox.stub(checkoutIntegrationSubscriptionService, 'getEnabledSubscriptions')
        .resolves([subscription1,subscription2,subscription3]);

      const result  = await checkoutSectionsService.getAvailableSections(checkoutFixture.simple('a'),businessFixture.simple('a'));

      expect(checkoutSectionMock.verify());
      expect(result.length).to.be.eq(3);
      expect(result).to.contain(section1);
      expect(result).to.contain(section3);
      expect(result).to.contain(section2);
    });

    it('No communication ', async () => {

      const section1 = sectionFixture.simple('1', SectionEnum.SendToDevice);
      const section2 = sectionFixture.simple('2');
      const section3 = sectionFixture.simple('3', SectionEnum.Shipping);

      const integration = integrationFixture.simple('2', 'name', IntegrationCategoryEnum.Shippings);
      const subscription1 = subscriptionFixture.simple('11');
      subscription1.integration = integration;

      const integration2 = integrationFixture.simple('3', 'name2');
      const subscription2 = subscriptionFixture.simple('22');
      subscription2.integration = integration2;

      const integration3 = integrationFixture.simple('4', 'name3');
      const subscription3 = subscriptionFixture.simple('33');
      subscription3.integration = integration3;

      checkoutSectionMock
        .expects('find')
        .resolves([section1,section2,section3]);

      sandbox.stub(checkoutIntegrationSubscriptionService, 'getEnabledSubscriptions')
        .resolves([subscription1,subscription2,subscription3]);

      const result  = await checkoutSectionsService.getAvailableSections(checkoutFixture.simple('a'),businessFixture.simple('a'));

      expect(checkoutSectionMock.verify());
      expect(result.length).to.be.eq(2);
      expect(result).to.contain(section3);
      expect(result).to.contain(section2);
      expect(result).not.to.contain(section1);
    });

    it('No shippings ', async () => {

      const section1 = sectionFixture.simple('1', SectionEnum.SendToDevice);
      const section2 = sectionFixture.simple('2');
      const section3 = sectionFixture.simple('3', SectionEnum.Shipping);

      const integration = integrationFixture.simple('2', 'name', IntegrationCategoryEnum.Communications);
      const subscription1 = subscriptionFixture.simple('11');
      subscription1.integration = integration;

      const integration2 = integrationFixture.simple('3', 'name2');
      const subscription2 = subscriptionFixture.simple('22');
      subscription2.integration = integration2;

      const integration3 = integrationFixture.simple('4', 'name3');
      const subscription3 = subscriptionFixture.simple('33');
      subscription3.integration = integration3;

      checkoutSectionMock
        .expects('find')
        .resolves([section1,section2,section3]);

      sandbox.stub(checkoutIntegrationSubscriptionService, 'getEnabledSubscriptions')
        .resolves([subscription1,subscription2,subscription3]);

      const result  = await checkoutSectionsService.getAvailableSections(checkoutFixture.simple('a'),businessFixture.simple('a'));

      expect(checkoutSectionMock.verify());
      expect(result.length).to.be.eq(2);
      expect(result).not.to.contain(section3);
      expect(result).to.contain(section2);
      expect(result).to.contain(section1);
    });

    it('No communication no settings', async () => {

      const section1 = sectionFixture.simple('1', SectionEnum.SendToDevice);
      const section2 = sectionFixture.simple('2');
      const section3 = sectionFixture.simple('3', SectionEnum.Shipping);

      const integration = integrationFixture.simple('2', 'name');
      const subscription1 = subscriptionFixture.simple('11');
      subscription1.integration = integration;

      const integration2 = integrationFixture.simple('3', 'name2');
      const subscription2 = subscriptionFixture.simple('22');
      subscription2.integration = integration2;

      const integration3 = integrationFixture.simple('4', 'name3');
      const subscription3 = subscriptionFixture.simple('33');
      subscription3.integration = integration3;

      checkoutSectionMock
        .expects('find')
        .resolves([section1,section2,section3]);

      sandbox.stub(checkoutIntegrationSubscriptionService, 'getEnabledSubscriptions')
        .resolves([subscription1,subscription2,subscription3]);

      const result  = await checkoutSectionsService.getAvailableSections(checkoutFixture.simple('a'),businessFixture.simple('a'));

      expect(checkoutSectionMock.verify());
      expect(result.length).to.be.eq(1);
      expect(result).to.contain(section2);
    });
  });

});
