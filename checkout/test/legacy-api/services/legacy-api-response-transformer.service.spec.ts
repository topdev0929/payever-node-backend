import { Test, TestingModule } from '@nestjs/testing';
import 'mocha';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import { ChannelSetModel } from '../../channelSet/models';
import { chaiExpect, matchLodash } from '../../common/chai-helpers';
import { PaymentMethodDto } from '../../integration/dto';
import { BusinessModel, PaymentModel } from '../../integration/models';
import {
  BusinessSchema,
  BusinessSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  PaymentSchema,
  PaymentSchemaName,
} from '../../integration/schemas';
import {
  ApiCallFailedDto,
  ApiCallSuccessDto,
  ChannelSetDto,
  CreatePaymentDto,
  PaymentCreateResultDto,
  PaymentListFilterDto,
} from '../dto';
import { ApiCallModel } from '../models';
import { ApiCallSchema, ApiCallSchemaName } from '../schemas';
import { LegacyApiResponseTransformerService } from './legacy-api-response-transformer.service';

const expect = chaiExpect;
const _ = matchLodash;

describe('LegacyApiResponseTransformerService', () => {
  let sandbox;
  let transformer: LegacyApiResponseTransformerService;

  const error: string = 'An api error occurred';
  const errorDescription: string = 'Not found';

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegacyApiResponseTransformerService],
    }).compile();

    transformer = module.get<LegacyApiResponseTransformerService>(LegacyApiResponseTransformerService);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('BusinessChannelSetsResponse', () => {
    context('BusinessChannelSets success response', () => {
      it('should return business channel sets success ApiCall', () => {
        const Business: mongoose.Model<BusinessModel> = mongoose.model(BusinessSchemaName, BusinessSchema);
        const business = new Business({_id: '123456'});

        const channelSetDTOs: ChannelSetDto[] = [
          {
            uuid: '123-123',
            channel_type: 'shopware',
          },
          {
            uuid: '456-456',
            channel_type: 'link',
          },
        ];

        const expectedResult = {
          call: {
            action: 'list_channel_sets',
            business_id: '123456',
            created_at: _.isDate,
            id: _.isString,
            status: 'success',
          },
          result: channelSetDTOs,
        } as ApiCallSuccessDto;

        expect(
          transformer.successBusinessChannelSetsResponse(
            business,
            channelSetDTOs,
          ),
        ).to.matchPattern(expectedResult);
      });
    });

    context('BusinessChannelSets failed response', () => {
      it('should return business channel sets failed ApiCall', () => {
        const Business: mongoose.Model<BusinessModel> = mongoose.model(BusinessSchemaName, BusinessSchema);
        const business = new Business({_id: '123456'});

        const expectedResult = {
          call: {
            action: 'list_channel_sets',
            business_id: '123456',
            created_at: _.isDate,
            id: _.isString,
            status: 'failed',
            message: errorDescription,
          },
          error: error,
          error_description: errorDescription,
        } as ApiCallFailedDto;

        expect(
          transformer.failedBusinessChannelSetsResponse(
            business,
            errorDescription,
          ),
        ).to.matchPattern(expectedResult);
      });
    });
  });

  describe('BusinessPaymentOptionsResponse', () => {
    context('BusinessPaymentOptions success response', () => {
      it('should return business payment options success ApiCall', () => {
        const Business: mongoose.Model<BusinessModel> = mongoose.model(BusinessSchemaName, BusinessSchema);
        const business = new Business({_id: '123456'});

        const ChannelSet: mongoose.Model<ChannelSetModel> = mongoose.model(ChannelSetSchemaName, ChannelSetSchema);
        const channelSet = new ChannelSet({type: 'shopware'});

        const paymentMethodDTOs: PaymentMethodDto[] = [
          {
            name: 'Santander Installments Norway',
            fixed_fee: 0,
            variable_fee: 0,
            accept_fee: false,
            payment_method: 'santander_installment_no',
            description_offer: 'description offer',
            description_fee: 'description fee',
            status: 'active',
            merchant_allowed_countries: ['DK', 'NO'],
            instruction_text: 'instruction text',
            related_country: 'NO',
            related_country_name: 'Norway',
            thumbnail1: 'thumbnail url',
            thumbnail2: 'thumbnail url',
            options: {
              currencies: ['NOK'],
              countries: ['NO'],
            },
            min: 202.8894,
            max: 8156.3574,
          },
          {
            name: 'Santander Invoice Norway',
            fixed_fee: 0,
            variable_fee: 0,
            accept_fee: false,
            payment_method: 'santander_invoice_no',
            description_offer: 'description offer',
            description_fee: 'description fee',
            status: 'active',
            merchant_allowed_countries: ['NO'],
            instruction_text: 'instruction text',
            related_country: 'NO',
            related_country_name: 'Norway',
            thumbnail1: 'thumbnail url',
            thumbnail2: 'thumbnail url',
            options: {
              currencies: ['NOK'],
              countries: ['NO'],
            },
            min: 20.2889,
            max: 3568.4063,
          },
        ];

        const expectedResult = {
          call: {
            action: 'list_payment_options',
            business_id: '123456',
            channel: 'shopware',
            created_at: _.isDate,
            id: _.isString,
            status: 'success',
          },
          result: paymentMethodDTOs,
        } as ApiCallSuccessDto;

        expect(
          transformer.successBusinessPaymentOptionsResponse(
            business,
            channelSet,
            paymentMethodDTOs,
          ),
        ).to.matchPattern(expectedResult);
      });
    });

    context('BusinessPaymentOptions failed response', () => {
      it('should return business payment options failed ApiCall', () => {
        const Business: mongoose.Model<BusinessModel> = mongoose.model(BusinessSchemaName, BusinessSchema);
        const business = new Business({_id: '123456'});

        const ChannelSet: mongoose.Model<ChannelSetModel> = mongoose.model(ChannelSetSchemaName, ChannelSetSchema);
        const channelSet = new ChannelSet({type: 'shopware'});

        const expectedResult = {
          call: {
            action: 'list_payment_options',
            business_id: '123456',
            channel: 'shopware',
            created_at: _.isDate,
            id: _.isString,
            status: 'failed',
            message: errorDescription,
          },
          error: error,
          error_description: errorDescription,
        } as ApiCallFailedDto;

        expect(
          transformer.failedBusinessPaymentOptionsResponse(
            business,
            channelSet,
            errorDescription,
          ),
        ).to.matchPattern(expectedResult);
      });
    });
  });

  describe('PaymentResponse', () => {
    context('Payment success response', () => {
      it('should return payment success ApiCall', () => {
        const Payment: mongoose.Model<PaymentModel> = mongoose.model(PaymentSchemaName, PaymentSchema);
        const payment = new Payment({
          _id: '5cf4e29b0db8d9ff7b82a0c8',
          uuid: '3dc8e758-87e9-4175-b371-3310c041aa07',
          amount: 20,
          billing_address: {
            uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
            salutation: 'SALUTATION_MRS',
            first_name: 'Stub',
            last_name: 'Waiting_bank',
            email: 'm.kunze@wasserbadmail.de',
            country: 'DE',
            country_name: 'Германия',
            city: 'Berlinad',
            zip_code: '73888',
            street: 'Sonnentalweg 18',
          },
          business_option_id: '28946',
          business_uuid: 'fdcae19d-af31-46e0-b63f-750459926ade',
          channel: 'other_shopsystem',
          channel_set_uuid: '82f99cac-83fb-44a9-82aa-c28ced2e44b6',
          color_state: 'yellow',
          created_at: '2018-08-09T06:26:13.000Z',
          currency: 'EUR',
          customer_email: 'm.kunze@wasserbadmail.de',
          customer_name: 'm.kunze@wasserbadmail.de',
          delivery_fee: 0,
          down_payment: 0,
          merchant_name: 'AutomationBusiness',
          original_id: '004997591c59facb48c93ce67e6e8355',
          payment_details: {
            initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            conditions_accepted: true,
          } as any,
          payment_fee: 0,
          payment_type: 'santander_factoring_de',
          reference: 'order-6eb3399',
          shipping_address: null,
          shipping_category: null,
          shipping_method_name: '',
          shipping_option_name: null,
          specific_status: 'WAITING_BANK',
          status: 'STATUS_IN_PROCESS',
          total: 20,
          updated_at: '2018-10-24T14:37:28.000Z',
        });

        const expectedResult = {
          call: {
            created_at: _.isDate,
            id: _.isString,
            status: 'success',
          },
          result: {
            address: {
              city: 'Berlinad',
              country: 'DE',
              country_name: 'Германия',
              email: 'm.kunze@wasserbadmail.de',
              first_name: 'Stub',
              last_name: 'Waiting_bank',
              salutation: 'SALUTATION_MRS',
              street: 'Sonnentalweg 18',
              uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
              zip_code: '73888',
            },
            amount: 20,
            channel: 'other_shopsystem',
            color_state: 'yellow',
            created_at: _.isDate,
            currency: 'EUR',
            customer_email: 'm.kunze@wasserbadmail.de',
            customer_name: 'm.kunze@wasserbadmail.de',
            delivery_fee: 0,
            down_payment: 0,
            id: '004997591c59facb48c93ce67e6e8355',
            merchant_name: 'AutomationBusiness',
            payment_details: {
              conditions_accepted: true,
              initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            },
            payment_details_array: {
              conditions_accepted: true,
              initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            },
            payment_fee: 0,
            payment_type: 'santander_factoring_de',
            reference: 'order-6eb3399',
            shipping_address: null,
            shipping_category: null,
            shipping_method_name: '',
            shipping_option_name: null,
            specific_status: 'WAITING_BANK',
            status: 'STATUS_IN_PROCESS',
            total: 20,
            updated_at: _.isDate,
          },
        } as ApiCallSuccessDto;

        expect(
          transformer.successPaymentResponse(payment),
        ).to.matchPattern(expectedResult);
      });
    });
  });

  describe('PaymentCreateResponse', () => {
    context('PaymentCreate success response', () => {
      it('should return payment create success ApiCall', () => {
        const redirectUrl = 'http://test.com/api/start-checkout/008518ca-1b38-4cc8-9d54-972f9899775e';
        const ApiCallCreate: mongoose.Model<ApiCallModel> = mongoose.model(ApiCallSchemaName, ApiCallSchema);

        const apiCallCreate = new ApiCallCreate({
          _id: '008518ca-1b38-4cc8-9d54-972f9899775e',
          fee: 0,
          channel: 'shopify',
          amount: 860,
          currency: 'EUR',
          order_id: '4981572403257',
          first_name: 'O',
          last_name: 'Mishenkin',
          street: 'Germany, Munich',
          country: 'DE',
          city: 'Munich',
          zip: '123123',
          email: 'olegm1990@mail.ru',
          cancel_url: 'cancel url',
          payment_method: 'paypal',
          success_url: 'success url',
          failure_url: 'failure url',
          businessId: '1ff47171-ffbb-447e-a391-932eb3da605f',
        });

        const expectedResult = {
          call: {
            amount: 860,
            business_id: '1ff47171-ffbb-447e-a391-932eb3da605f',
            cancel_url: 'cancel url',
            channel: 'shopify',
            city: 'Munich',
            country: 'DE',
            created_at: _.isDate,
            currency: 'EUR',
            email: 'olegm1990@mail.ru',
            failure_url: 'failure url',
            fee: 0,
            first_name: 'O',
            id: '008518ca-1b38-4cc8-9d54-972f9899775e',
            last_name: 'Mishenkin',
            order_id: '4981572403257',
            payment_method: 'paypal',
            status: 'new',
            street: 'Germany, Munich',
            success_url: 'success url',
            type: 'create',
            zip: '123123',
          },
          redirect_url: redirectUrl,
        } as PaymentCreateResultDto;

        expect(
          transformer.successPaymentCreateResponse(
            apiCallCreate,
            redirectUrl,
          ),
        ).to.matchPattern(expectedResult);
      });
    });

    context('PaymentCreate failed response', () => {
      it('should return payment create failed ApiCall', () => {
        const paymentDto = {
          amount: 15500,
          order_id: 'oiuoiuiou341221355',
          currency: 'NOK',
          first_name: 'Stub',
          last_name: 'Approved',
          payment_method: 'santander_installment',
          channel: 'api',
          country: 'NO',
        };

        const expectedResult = {
          call: {
            amount: 15500,
            channel: 'api',
            country: 'NO',
            created_at: _.isDate,
            currency: 'NOK',
            first_name: 'Stub',
            id: _.isString,
            last_name: 'Approved',
            message: errorDescription,
            order_id: 'oiuoiuiou341221355',
            payment_method: 'santander_installment',
            status: 'failed',
            type: 'create',
          },
          error: error,
          error_description: errorDescription,
        } as ApiCallFailedDto;

        expect(
          transformer.failedPaymentCreateResponse(
            paymentDto as CreatePaymentDto,
            errorDescription,
          ),
        ).to.matchPattern(expectedResult);
      });
    });
  });

  describe('PaymentListResponse', () => {
    context('PaymentList success response', () => {
      it('should return payments list success ApiCall', () => {
        const filterDTO = new PaymentListFilterDto('santander-factoring-de', null, 'EUR', null, '5');
        const Payment: mongoose.Model<PaymentModel> = mongoose.model(PaymentSchemaName, PaymentSchema);
        const payment = new Payment({
          _id: '5cf4e29b0db8d9ff7b82a0c8',
          uuid: '3dc8e758-87e9-4175-b371-3310c041aa07',
          amount: 20,
          billing_address: {
            uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
            salutation: 'SALUTATION_MRS',
            first_name: 'Stub',
            last_name: 'Waiting_bank',
            email: 'm.kunze@wasserbadmail.de',
            country: 'DE',
            country_name: 'Германия',
            city: 'Berlinad',
            zip_code: '73888',
            street: 'Sonnentalweg 18',
          },
          business_option_id: '28946',
          business_uuid: 'fdcae19d-af31-46e0-b63f-750459926ade',
          channel: 'other_shopsystem',
          channel_set_uuid: '82f99cac-83fb-44a9-82aa-c28ced2e44b6',
          color_state: 'yellow',
          created_at: '2018-08-09T06:26:13.000Z',
          currency: 'EUR',
          customer_email: 'm.kunze@wasserbadmail.de',
          customer_name: 'm.kunze@wasserbadmail.de',
          delivery_fee: 0,
          down_payment: 0,
          merchant_name: 'AutomationBusiness',
          original_id: '004997591c59facb48c93ce67e6e8355',
          payment_details: {
            initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            conditions_accepted: true,
          } as any,
          payment_fee: 0,
          payment_type: 'santander_factoring_de',
          reference: 'order-6eb3399',
          shipping_address: null,
          shipping_category: null,
          shipping_method_name: '',
          shipping_option_name: null,
          specific_status: 'WAITING_BANK',
          status: 'STATUS_IN_PROCESS',
          total: 20,
          updated_at: '2018-10-24T14:37:28.000Z',
        });

        const expectedResult = {
          call: {
            created_at: _.isDate,
            currency: 'EUR',
            id: _.isString,
            limit: 5,
            payment_method: 'santander-factoring-de',
            status: 'success',
            date: null,
            state: null,
            type: 'list',
          },
          result: [
            {
              address: {
                city: 'Berlinad',
                country: 'DE',
                country_name: 'Германия',
                email: 'm.kunze@wasserbadmail.de',
                first_name: 'Stub',
                last_name: 'Waiting_bank',
                salutation: 'SALUTATION_MRS',
                street: 'Sonnentalweg 18',
                uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
                zip_code: '73888',
              },
              amount: 20,
              channel: 'other_shopsystem',
              color_state: 'yellow',
              created_at: _.isDate,
              currency: 'EUR',
              customer_email: 'm.kunze@wasserbadmail.de',
              customer_name: 'm.kunze@wasserbadmail.de',
              delivery_fee: 0,
              down_payment: 0,
              id: '004997591c59facb48c93ce67e6e8355',
              merchant_name: 'AutomationBusiness',
              payment_details: {
                conditions_accepted: true,
                initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
              },
              payment_details_array: {
                conditions_accepted: true,
                initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
              },
              payment_fee: 0,
              payment_type: 'santander_factoring_de',
              reference: 'order-6eb3399',
              shipping_address: null,
              shipping_category: null,
              shipping_method_name: '',
              shipping_option_name: null,
              specific_status: 'WAITING_BANK',
              status: 'STATUS_IN_PROCESS',
              total: 20,
              updated_at: _.isDate,
            },
          ],
        } as ApiCallSuccessDto;

        expect(
          transformer.successPaymentListResponse(
            filterDTO,
            [payment],
          ),
        ).to.matchPattern(expectedResult);
      });
    });

    context('PaymentList failed response', () => {
      it('should return payments list failed ApiCall', () => {
        const filterDTO = new PaymentListFilterDto(
          'santander-factoring-de',
          '2018-08-09',
          'EUR',
          'STATUS_ACCEPTED',
          '5',
        );

        const businessId = '12345-12345';

        const expectedResult = {
          call: {
            business_id: businessId,
            created_at: _.isDate,
            currency: 'EUR',
            date: '2018-08-09',
            id: _.isString,
            limit: 5,
            message: 'Not found',
            payment_method: 'santander-factoring-de',
            state: 'STATUS_ACCEPTED',
            status: 'failed',
            type: 'list',
          },
          error: 'An api error occurred',
          error_description: 'Not found',
        };

        expect(
          transformer.failedPaymentListResponse(
            filterDTO,
            businessId,
            errorDescription,
          ),
        ).to.matchPattern(expectedResult);
      });
    });
  });

  describe('PaymentActionResponse', () => {
    context('PaymentAction success and failed response', () => {
      it('should return payment action success and failed ApiCall', () => {
        const Payment: mongoose.Model<PaymentModel> = mongoose.model(PaymentSchemaName, PaymentSchema);
        const payment = new Payment({
          _id: '5cf4e29b0db8d9ff7b82a0c8',
          uuid: '3dc8e758-87e9-4175-b371-3310c041aa07',
          amount: 20,
          billing_address: {
            uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
            salutation: 'SALUTATION_MRS',
            first_name: 'Stub',
            last_name: 'Waiting_bank',
            email: 'm.kunze@wasserbadmail.de',
            country: 'DE',
            country_name: 'Германия',
            city: 'Berlinad',
            zip_code: '73888',
            street: 'Sonnentalweg 18',
          },
          business_option_id: '28946',
          business_uuid: 'fdcae19d-af31-46e0-b63f-750459926ade',
          channel: 'other_shopsystem',
          channel_set_uuid: '82f99cac-83fb-44a9-82aa-c28ced2e44b6',
          color_state: 'yellow',
          created_at: '2018-08-09T06:26:13.000Z',
          currency: 'EUR',
          customer_email: 'm.kunze@wasserbadmail.de',
          customer_name: 'm.kunze@wasserbadmail.de',
          delivery_fee: 0,
          down_payment: 0,
          merchant_name: 'AutomationBusiness',
          original_id: '004997591c59facb48c93ce67e6e8355',
          payment_details: {
            initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            conditions_accepted: true,
          } as any,
          payment_fee: 0,
          payment_type: 'santander_factoring_de',
          reference: 'order-6eb3399',
          shipping_address: null,
          shipping_category: null,
          shipping_method_name: '',
          shipping_option_name: null,
          specific_status: 'WAITING_BANK',
          status: 'STATUS_REFUNDED',
          total: 20,
          updated_at: '2018-10-24T14:37:28.000Z',
        });

        const action = 'refund';
        const actionDTO = { amount: 15 };

        const expectedSuccessResult = {
          call: {
            amount: 15,
            business_id: 'fdcae19d-af31-46e0-b63f-750459926ade',
            created_at: _.isDate,
            id: _.isString,
            payment_id: '004997591c59facb48c93ce67e6e8355',
            status: 'success',
            type: 'refund',
          },
          result: {
            address: {
              city: 'Berlinad',
              country: 'DE',
              country_name: 'Германия',
              email: 'm.kunze@wasserbadmail.de',
              first_name: 'Stub',
              last_name: 'Waiting_bank',
              salutation: 'SALUTATION_MRS',
              street: 'Sonnentalweg 18',
              uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
              zip_code: '73888',
            },
            amount: 20,
            channel: 'other_shopsystem',
            color_state: 'yellow',
            created_at: _.isDate,
            currency: 'EUR',
            customer_email: 'm.kunze@wasserbadmail.de',
            customer_name: 'm.kunze@wasserbadmail.de',
            delivery_fee: 0,
            down_payment: 0,
            id: '004997591c59facb48c93ce67e6e8355',
            merchant_name: 'AutomationBusiness',
            payment_details: {
              conditions_accepted: true,
              initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            },
            payment_details_array: {
              conditions_accepted: true,
              initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
            },
            payment_fee: 0,
            payment_type: 'santander_factoring_de',
            reference: 'order-6eb3399',
            shipping_address: null,
            shipping_category: null,
            shipping_method_name: '',
            shipping_option_name: null,
            specific_status: 'WAITING_BANK',
            status: 'STATUS_REFUNDED',
            total: 20,
            updated_at: _.isDate,
          },
        } as ApiCallSuccessDto;

        expect(
          transformer.successPaymentActionResponse(
            payment,
            action,
            actionDTO,
          ),
        ).to.matchPattern(expectedSuccessResult);

        const expectedFailedResult = {
          call: {
            amount: 15,
            business_id: 'fdcae19d-af31-46e0-b63f-750459926ade',
            created_at: _.isDate,
            id: _.isString,
            message: 'Not found',
            payment_id: '004997591c59facb48c93ce67e6e8355',
            status: 'failed',
            type: 'refund',
          },
          error: 'An api error occurred',
          error_description: 'Not found',
        } as ApiCallFailedDto;

        expect(
          transformer.failedPaymentActionResponse(
            payment,
            action,
            actionDTO,
            errorDescription,
          ),
        ).to.matchPattern(expectedFailedResult);
      });
    });
  });
});
