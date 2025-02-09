import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencySchema, CurrencySchemaName, LanguageService } from '@pe/common-sdk';
import { RabbitMqClient, RabbitMqClientOptionsInterface } from '@pe/nest-kit';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Logger } from 'mongodb';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import 'sinon-mongoose';
import { ChannelSetModel } from '../../../src/channel-set/models';
import { ChannelSetRabbitProducer } from '../../../src/channel-set/producers';
import { ChannelSetService } from '../../../src/channel-set/services';
import { CheckoutRabbitProducer } from '../../../src/checkout/rabbit-producers';
import {
  CheckoutIntegrationSubscriptionService,
  CheckoutService,
  SectionsService,
  ValidationService,
} from '../../../src/checkout/services';
import { BusinessModel } from '../../../src/integration/models';
import {
  BusinessIntegrationSubscriptionService,
  BusinessService,
  IntegrationService,
} from '../../../src/integration/services';
import { CurrencyExchangeService } from '../../../src/legacy-api/services';
import {
  BusinessSchema,
  BusinessSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
  SectionSchema,
  SectionSchemaName,
} from '../../../src/mongoose-schema';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('ChannelSetService', async () => {
  let sandbox: sinon.SinonSandbox;

  let businessService : (BusinessService);
  let checkoutService : (CheckoutService);
  let rabbitChannelSetService : (ChannelSetRabbitProducer);
  let businessModel : BusinessModel;
  let channelSetModel: ChannelSetModel;

  let testService : (ChannelSetService);

  let businessMock : sinon.SinonMock;
  let checkoutMock : sinon.SinonMock;
  let rabbitMock: sinon.SinonMock;
  let channelSetModelMock : sinon.SinonMock;
  let businessModelMock: sinon.SinonMock;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ChannelSetService,
        BusinessService,
        BusinessIntegrationSubscriptionService,
        IntegrationService,
        CheckoutService,
        CheckoutIntegrationSubscriptionService,
        SectionsService,
        ValidationService,
        CheckoutRabbitProducer,
        ChannelSetRabbitProducer,
        RabbitMqClient,
        RabbitMqClientOptionsInterface,
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
          provide: getModelToken(ChannelSetSchemaName),
          useValue: mongoose.model(ChannelSetSchemaName, ChannelSetSchema),
        },
        {
          provide: getModelToken(CurrencySchemaName),
          useValue: mongoose.model(CurrencySchemaName, CurrencySchema),
        },
      ],
    }).compile();

    businessService = module.get<BusinessService>(BusinessService);
    checkoutService = module.get<CheckoutService>(CheckoutService);
    rabbitChannelSetService = module.get<ChannelSetRabbitProducer>(ChannelSetRabbitProducer);

    businessModel = module.get(getModelToken(BusinessSchemaName));
    channelSetModel = module.get(getModelToken(ChannelSetSchemaName));

    testService = module.get<ChannelSetService>(ChannelSetService);
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
