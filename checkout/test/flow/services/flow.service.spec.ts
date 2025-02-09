import { HttpService } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from '@pe/common-sdk';
import { RabbitMqClient } from '@pe/nest-kit';
import { NEST_EVENT_EMITTER } from '@pe/nest-kit/modules/event-emitter/constants';
import { RabbitMqClientOptions } from '@pe/nest-kit/modules/rabbit-mq/rabbit-mq-client-options';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Logger } from 'mongodb';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { FlowService } from '.';
import { BusinessFixture } from '../../../test/unit/business.fixture';
import { CheckoutFixture } from '../../../test/unit/checkouts.fixture';
import {
  ApplicationFixture,
  ApplicationSubscriptionFixture,
  IntegrationsFixture,
  IntegrationSubscriptionFixture,
} from '../../../test/unit/integrations.fixture';
import { ChannelSetModel } from '../../channelSet/models';
import { ChannelSetRabbitmqService, ChannelSetService } from '../../channelSet/services';
import {
  CheckoutIntegrationSubscriptionService,
  CheckoutRabbitmqService,
  CheckoutSectionsService,
  CheckoutService,
  ValidationService,
} from '../../checkout';
import {
  BusinessModel,
  BusinessSchema,
  BusinessSchemaName,
  BusinessService,
  ChannelSetSchema,
  ChannelSetSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  CheckoutSectionSchema,
  CheckoutSectionSchemaName,
  CurrencyExchangeService,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationService,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
  IntegrationSubscriptionService,
} from '../../integration';
import { CurrencySchema, CurrencySchemaName } from '../../integration/schemas/currency.schema';
import { FlowCheckoutConverter } from '../conventers/flow-checkout.converter';
import { FlowSchema, FlowSchemaName } from '../schemas';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('FlowService', async () => {
  let sandbox: sinon.SinonSandbox;

  let businessService : (BusinessService);
  let checkoutService : (CheckoutService);
  let rabbitChannelSetService : (ChannelSetRabbitmqService);
  let businessModel : BusinessModel;
  let channelSetModel: ChannelSetModel;

  let testService : (ChannelSetService);

  let businessMock : sinon.SinonMock;
  let checkoutMock : sinon.SinonMock;
  let rabbitMock: sinon.SinonMock;
  let channelSetModelMock : sinon.SinonMock;
  let businessModelMock: sinon.SinonMock;

  let integrationFixture: IntegrationsFixture;
  let businessFixture: BusinessFixture;
  let subscriptionFixture: IntegrationSubscriptionFixture;
  let applicationFixture: ApplicationFixture;
  let subscriptionFixture: ApplicationSubscriptionFixture;
  let checkoutFixture: CheckoutFixture;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowService,
        FlowCheckoutConverter,
        Logger,
        ChannelSetService,
        BusinessService,
        IntegrationSubscriptionService,
        IntegrationService,
        CheckoutService,
        CheckoutIntegrationSubscriptionService,
        CheckoutSectionsService,
        ValidationService,
        CheckoutRabbitmqService,
        ChannelSetRabbitmqService,
        RabbitMqClient,
        RabbitMqClientOptions,
        CurrencyExchangeService,
        {
          provide: HttpService,
          useValue: {
          },
        },

        {
          provide: LanguageService,
          useValue: {
            getLanguage: () => { ''; },
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
          provide: getModelToken(CheckoutSectionSchemaName),
          useValue: mongoose.model(CheckoutSectionSchemaName, CheckoutSectionSchema),
        },
        {
          provide: getModelToken(ChannelSetSchemaName),
          useValue: mongoose.model(ChannelSetSchemaName, ChannelSetSchema),
        },
        {
          provide: getModelToken(FlowSchemaName),
          useValue: mongoose.model(FlowSchemaName, FlowSchema),
        },
        {
          provide: getModelToken(CurrencySchemaName),
          useValue: mongoose.model(CurrencySchemaName, CurrencySchema),
        },
        {
          provide: NEST_EVENT_EMITTER,
          useValue: {
            emit: (): void => {},
          },
        },
      ],
    }).compile();

    businessService = module.get<BusinessService>(BusinessService);
    checkoutService = module.get<CheckoutService>(CheckoutService);
    rabbitChannelSetService = module.get<ChannelSetRabbitmqService>(ChannelSetRabbitmqService);

    businessModel = module.get(getModelToken(BusinessSchemaName));
    channelSetModel = module.get(getModelToken(ChannelSetSchemaName));

    testService = module.get<ChannelSetService>(ChannelSetService);

    applicationFixture = new ApplicationFixture();
    integrationFixture = new IntegrationsFixture();
    businessFixture = new BusinessFixture();
    subscriptionFixture = new IntegrationSubscriptionFixture();
    subscriptionFixture = new ApplicationSubscriptionFixture();
    checkoutFixture = new CheckoutFixture();
});

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    businessMock = sinon.mock(businessService) as sinon.SinonMock;
    checkoutMock = sinon.mock(checkoutService) as sinon.SinonMock;
    rabbitMock = sinon.mock(rabbitChannelSetService) as sinon.SinonMock;

    businessModelMock =  sinon.mock(businessModel) as sinon.SinonMock;
    channelSetModelMock =  sinon.mock(channelSetModel) as sinon.SinonMock;
  });

  afterEach(async () => {
    sandbox.restore();

    rabbitMock.restore();
    businessMock.restore();
    checkoutMock.restore();
    businessModelMock.restore();
    channelSetModelMock.restore();

    sandbox = undefined;
  });

  describe('stub test', () => {
    it('ok', async () => {

    });
  });

});
