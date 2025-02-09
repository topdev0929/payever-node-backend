import { HttpService } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as fastifyCookie from 'fastify-cookie';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import { ChannelSetModel } from '../../channelSet/models';
import { ChannelSetService } from '../../channelSet/services';
import { chaiAssert, chaiExpect, matchLodash } from '../../common/chai-helpers';
import { FlowService } from '../../flow/services';
import { BusinessModel, CheckoutModel } from '../../integration/models';
import {
  BusinessSchema,
  BusinessSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
} from '../../integration/schemas';
import { BusinessService } from '../../integration/services';
import { CreatePaymentDto } from '../dto';
import { SalutationEnum } from '../enum';
import { ApiCallModel } from '../models';
import { ApiCallSchema, ApiCallSchemaName } from '../schemas';
import { PaymentApiCallService } from './payment-api-call.service';

const expect = chaiExpect;
const assert = chaiAssert;
const _ = matchLodash;

describe('PaymentApiCallService', () => {
  let app;
  let sandbox;
  let paymentApiCallService: PaymentApiCallService;

  const businessId = '12345-12345';
  const apiCallId = '45634-84758';
  const channelSetId = '45634-84758';

  const ApiCallCreate: mongoose.Model<ApiCallModel> = mongoose.model(ApiCallSchemaName, ApiCallSchema);
  const Business: mongoose.Model<BusinessModel> = mongoose.model(BusinessSchemaName, BusinessSchema);
  const ChannelSet: mongoose.Model<ChannelSetModel> = mongoose.model(ChannelSetSchemaName, ChannelSetSchema);
  const Checkout: mongoose.Model<CheckoutModel> = mongoose.model(CheckoutSchemaName, CheckoutSchema);

  const apiCallModel = {
    create: async (): void => {},
  };

  const businessService = {
    findOneById: async (): void => {},
  };

  const channelSetService = {
    findDefaultForBusiness: async (): void => {},
    findOneById: async (): void => {},
  };

  before(async () => {
    const fastifyAdapter = new FastifyAdapter();
    fastifyAdapter.register(fastifyCookie);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentApiCallService,
        {
          provide: 'ApiCallModel',
          useValue: apiCallModel,
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: ChannelSetService,
          useValue: channelSetService,
        },
        {
          provide: BusinessService,
          useValue: businessService,
        },
        {
          provide: FlowService,
          useValue: {},
        },
      ],
    }).compile();

    paymentApiCallService = module.get<PaymentApiCallService>(PaymentApiCallService);

    app = module.createNestApplication(fastifyAdapter);
    await app.init();
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('createApiCallFromPaymentDTO', () => {
    it('should return ApiCall model', async () => {
      const paymentDto = {
        salutation: 'mr',
        amount: 15500,
        order_id: 'oiuoiuiou341221355',
        currency: 'NOK',
        first_name: 'Stub',
        last_name: 'Approved',
        payment_method: 'santander_installment',
        channel: 'api',
        country: 'NO',
      } as CreatePaymentDto;

      const { salutation, ...paymentDtoData } = paymentDto;

      const expectedResult = {
        ...paymentDtoData,
        _id: _.isString,
        salutation: 'SALUTATION_MR',
        fee: 0,
        businessId: businessId,
      };

      sandbox.stub(apiCallModel, 'create').callsFake((args) => {
        return new ApiCallCreate(args);
      });

      const result = await paymentApiCallService.createApiCallFromPaymentDTO(
        businessId,
        paymentDto as CreatePaymentDto,
      );

      assert.instanceOf(result, ApiCallCreate);
      expect(result.toObject()).to.matchPattern(expectedResult);
    });
  });

  describe('initFlowCreateRequest', () => {
    const apiCall = new ApiCallCreate({
      _id: apiCallId,
      salutation: SalutationEnum.MR,
      amount: 15500,
      order_id: 'oiuoiuiou341221355',
      currency: 'NOK',
      first_name: 'Stub',
      last_name: 'Approved',
      payment_method: 'santander_installment',
      channel: 'api',
      country: 'NO',
      businessId: businessId,
    });

    const business = new Business({_id: businessId});
    const checkout = new Checkout({ businessId: businessId });
    const channelSet = new ChannelSet({
      _id: channelSetId,
      checkout: checkout,
    });

    const expectedSuccessResult = {
      amount: 15500,
      api_call_id: apiCallId,
      billing_address: {
        country: 'NO',
        first_name: 'Stub',
        last_name: 'Approved',
        salutation: 'SALUTATION_MR',
        type: 'billing',
      },
      channel_set_id: channelSetId,
      currency: 'NOK',
      payment_method: 'santander_installment',
      reference: 'oiuoiuiou341221355',
      '...': '',
    };

    it('ChannelSet id is set', async () => {
      apiCall.channel_set_id = channelSetId;

      sandbox.stub(businessService, 'findOneById').withArgs(businessId).returns(business);
      sandbox.stub(channelSetService, 'findOneById').withArgs(channelSetId).returns(channelSet);
      sandbox.stub(channelSet, 'populate').returns({
        execPopulate: sandbox.stub().resolves(channelSet),
      });

      const result = await paymentApiCallService.initFlowCreateRequest(apiCall);
      expect(result).to.matchPattern(expectedSuccessResult);
    });

    it('ChannelSet id is not set', async () => {
      apiCall.channel_set_id = null;

      sandbox.stub(businessService, 'findOneById').withArgs(businessId).returns(business);
      sandbox.stub(channelSetService, 'findDefaultForBusiness').withArgs(business, 'api').returns(channelSet);

      const result = await paymentApiCallService.initFlowCreateRequest(apiCall);
      expect(result).to.matchPattern(expectedSuccessResult);
    });

    it('should throw exception if ChannelSet doesn\'t belong to business, ', async () => {
      apiCall.channel_set_id = channelSetId;
      channelSet.checkout.businessId = '1111-1111';

      sandbox.stub(businessService, 'findOneById').withArgs(businessId).returns(business);
      sandbox.stub(channelSetService, 'findOneById').withArgs(channelSetId).returns(channelSet);
      sandbox.stub(channelSet, 'populate').returns({
        execPopulate: sandbox.stub().resolves(channelSet),
      });

      return paymentApiCallService.initFlowCreateRequest(apiCall)
        .catch((error) => {
          expect(error.message).to.contains('Channel set 45634-84758 doesn\'t belong to business 12345-12345');
        });
    });
  });
});
