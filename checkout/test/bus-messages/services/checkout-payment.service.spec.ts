/* eslint-disable no-big-function */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencySchema, CurrencySchemaName, LanguageService } from '@pe/common-sdk';
import { RabbitMqClient } from '@pe/nest-kit';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Logger } from 'mongodb';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { CombinedCheckoutStatInterface, CombinedPaymentOptionsInterface } from '../../../src/bus-messages/interfaces';
import { CheckoutPaymentService } from '../../../src/bus-messages/services';
import { BusinessModel } from '../../../src/business/models';
import { BusinessService } from '../../../src/business/services';
import { ChannelSetModel } from '../../../src/channel-set/models';
import { CheckoutModel } from '../../../src/checkout';
import { CheckoutRabbitProducer } from '../../../src/checkout/rabbit-producers';
import {
  CheckoutIntegrationSubscriptionService,
  CheckoutService,
  SectionsService,
  ValidationService,
} from '../../../src/checkout/services';
import { IntegrationSubscriptionModel } from '../../../src/integration/models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../../../src/integration/services';
import { CurrencyExchangeService } from '../../../src/legacy-api/services';
import {
  BusinessSchema,
  BusinessSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
  SectionSchema,
  SectionSchemaName,
} from '../../../src/mongoose-schema';
import {
  BusinessFixture,
  BusinessIntegrationSubscriptionFixture,
  CheckoutFixture,
  CheckoutIntegrationSubscriptionFixture,
} from '../../fixtures';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('CheckoutPaymentService', async () => {
  let sandbox: sinon.SinonSandbox;

  let validationService: (ValidationService);
  let businessService: (BusinessService);
  let checkoutService: (CheckoutService);
  let businessIntegrationService: (BusinessIntegrationSubscriptionService);
  let checkoutIntegrationService: (CheckoutIntegrationSubscriptionService);

  let testService: (CheckoutPaymentService);

  let validationMock: sinon.SinonMock;
  let businessMock: sinon.SinonMock;
  let checkoutMock: sinon.SinonMock;
  let businessIntegrationMock: sinon.SinonMock;
  let checkoutIntegrationMock: sinon.SinonMock;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        CheckoutPaymentService,
        BusinessService,
        BusinessIntegrationSubscriptionService,
        IntegrationService,
        CheckoutService,
        CheckoutIntegrationSubscriptionService,
        SectionsService,
        ValidationService,
        CheckoutRabbitProducer,
        RabbitMqClient,
        CurrencyExchangeService,
        {
          provide: LanguageService,
          useValue: {
            getLanguage: (): void => { ''; },
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
          provide: getModelToken(IntegrationSubscriptionSchemaName),
          useValue: mongoose.model(IntegrationSubscriptionSchemaName, IntegrationSubscriptionSchema),
        },
        {
          provide: getModelToken(SectionSchemaName),
          useValue: mongoose.model(SectionSchemaName, SectionSchema),
        },
        {
          provide: getModelToken(CurrencySchemaName),
          useValue: mongoose.model(CurrencySchemaName, CurrencySchema),
        },
      ],
    }).compile();

    validationService = module.get<ValidationService>(ValidationService);
    businessService = module.get<BusinessService>(BusinessService);
    checkoutService = module.get<CheckoutService>(CheckoutService);
    businessIntegrationService =
      module.get<BusinessIntegrationSubscriptionService>(BusinessIntegrationSubscriptionService);
    checkoutIntegrationService =
      module.get<CheckoutIntegrationSubscriptionService>(CheckoutIntegrationSubscriptionService);

    testService = module.get<CheckoutPaymentService>(CheckoutPaymentService);
});

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    validationMock = sinon.mock(validationService) as sinon.SinonMock;
    businessMock = sinon.mock(businessService) as sinon.SinonMock;
    checkoutMock = sinon.mock(checkoutService) as sinon.SinonMock;
    businessIntegrationMock = sinon.mock(businessIntegrationService) as sinon.SinonMock;
    checkoutIntegrationMock = sinon.mock(checkoutIntegrationService) as sinon.SinonMock;
  });

  afterEach(async () => {
    sandbox.restore();
    validationMock.restore();
    businessMock.restore();
    checkoutMock.restore();
    businessIntegrationMock.restore();
    checkoutIntegrationMock.restore();
    sandbox = undefined;
  });

  describe('combineCheckoutStat', () => {
    it('ok', async () => {
      const business: BusinessModel = BusinessFixture.simple('a');
      const checkout: any = {};
      const integrations: IntegrationSubscriptionModel[] = [];
      const integrationPayments: IntegrationSubscriptionModel =
        BusinessIntegrationSubscriptionFixture.category('payments');
      integrations.push(integrationPayments);
      const integrationShop: IntegrationSubscriptionModel =
        BusinessIntegrationSubscriptionFixture.category('shopsystems');
      integrations.push(integrationShop);
      const integrationApplications: IntegrationSubscriptionModel =
        BusinessIntegrationSubscriptionFixture.category('applications');
      integrations.push(integrationApplications);
      const integrationSimple: IntegrationSubscriptionModel =
        BusinessIntegrationSubscriptionFixture.category('other');
      integrations.push(integrationSimple);

      validationMock
        .expects('getBusiness')
        .withArgs(business.id)
        .resolves(business);
      checkoutMock
        .expects('findAllByBusiness')
        .withArgs(business)
        .resolves([checkout]);
      businessIntegrationMock
        .expects('findByCategory')
        .withArgs(business)
        .resolves(integrations);

      const result: CombinedCheckoutStatInterface = await testService.combineCheckoutStat(business.id);

      expect(validationMock.verify());
      expect(checkoutMock.verify());
      expect(businessIntegrationMock.verify());

      expect(result.checkout.length).to.be.eq(1);
      expect(result.checkout).to.contain(checkout);

      expect(result.paymentOptions.length).to.be.eq(1);
      expect(result.paymentOptions).to.contain(integrationPayments);

      expect(result.channels.length).to.be.eq(2);
      expect(result.channels).to.contain(integrationShop.integration.displayOptions);
      expect(result.channels).to.contain(integrationApplications.integration.displayOptions);
    });
  });

  describe('combinePaymentOptions', () => {
    it('ok', async () => {
      const business: BusinessModel = BusinessFixture.simple('id1');
      const checkout: CheckoutModel = CheckoutFixture.simple('id1');
      const channel: ChannelSetModel = BusinessFixture.createChannelSet(true, checkout);
      business.channelSets.push(channel);
      business.channelSets.push(BusinessFixture.createChannelSet(false));
      business.channelSets.push(BusinessFixture.createChannelSet(false));

      const subscriptions: IntegrationSubscriptionModel[] = [];
      const integration1: IntegrationSubscriptionModel =
        CheckoutIntegrationSubscriptionFixture.category('payments', 'icon1', 'title1');
      subscriptions.push(integration1);
      const integration2: IntegrationSubscriptionModel =
        CheckoutIntegrationSubscriptionFixture.category('payments', 'icon2', 'title2');
      subscriptions.push(integration2);

      validationMock
        .expects('getBusiness')
        .withArgs(business.id)
        .resolves(business);
      businessMock
        .expects('findOneById')
        .withArgs(business.id)
        .resolves(business);
      checkoutIntegrationMock
        .expects('getEnabledSubscriptions')
        .withArgs(checkout, business)
        .resolves(subscriptions);

      const result: CombinedPaymentOptionsInterface[] = await testService.combinePaymentOptions(business.id);

      expect(validationMock.verify());
      expect(checkoutMock.verify());
      expect(businessMock.verify());

      expect(result.length).to.be.eq(2);
      expect(result[0].icon).to.be.eq(integration1.integration.displayOptions.icon);
      expect(result[0].title).to.be.eq(integration1.integration.displayOptions.title);
    });
  });

  describe('findActiveChannelSet', () => {
    it('ok', async () => {
      const business: BusinessModel = BusinessFixture.simple('id1');
      const channel: ChannelSetModel = BusinessFixture.createChannelSet(true);
      business.channelSets.push(channel);
      business.channelSets.push(BusinessFixture.createChannelSet(false));
      business.channelSets.push(BusinessFixture.createChannelSet(false));

      validationMock
        .expects('getBusiness')
        .withArgs(business.id)
        .resolves(business);

      const result: ChannelSetModel = await testService.findActiveChannelSet(business.id);

      expect(validationMock.verify());
      expect(result).to.be.not.null;
    });
  });
});
