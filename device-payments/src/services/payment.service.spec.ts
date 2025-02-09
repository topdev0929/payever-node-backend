import { Test } from '@nestjs/testing';
import * as chai from 'chai';
import { plainToClass } from 'class-transformer';
import 'mocha';
import * as sinon from 'sinon';

import { PaymentDto } from '../dto';
import { PaymentSource, VerificationType } from '../enum';
import { BusinessInterface, PaymentCode, TerminalInterface } from '../interfaces';
import { PaymentService } from './payment.service';

const expect = chai.expect;

describe('Payment service', () => {
  let sandbox;
  let paymentService: PaymentService;

  const paymentCodeModel = {
    create: async (paymentCode): Promise<PaymentCode> =>  {
      return paymentCode;
    },

    findOne:  async (): Promise<PaymentCode> => null,
  };

  const terminalModel = {
    findOne: () => null,
    populate: async (): Promise<TerminalInterface> => null,
  };

  const businessModel = {
    findOne: () => null,
  };

  const codeGeneratorService = {
    generate: async () => 123456,
  };

  before(async () => {
    const module = await Test.createTestingModule(
      {
        providers: [
          PaymentService,
          {
            provide: 'CodeGeneratorService',
            useValue: codeGeneratorService,
          },
          {
            provide: 'BusinessModel',
            useValue: businessModel,
          }, {
            provide: 'TerminalModel',
            useValue: terminalModel,
          }, {
            provide: 'PaymentCodeModel',
            useValue: paymentCodeModel,
          }],
      })
      .compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  it('should generate a code and store it', async () => {
    const business: BusinessInterface = {
      businessId: 'cfd953a7-3c9c-4109-a8c5-fbb08a6e1d11',
      defaultTerminalId: 'a7f90904-800f-4aef-b926-f0e0f3b65322',
      settings: {
        enabled: true,
        verificationType: VerificationType.verifyByPayment,
        autoresponderEnabled: true,
        secondFactor: false,
      },
    };

    const terminal: TerminalInterface = {
      _id: 'fb4dff41-6313-440a-8916-0fb5aa8dee78',
      businessId: 'cfd953a7-3c9c-4109-a8c5-fbb08a6e1d11',
      checkout: {
        _id: '493f7ec6-8d08-4f32-a7d7-b0f9945c7be0',
        phoneNumber: '+79528224321',
        message: '',
        keyword: 'test',
      },
      channelSetId: '26990611-f94f-4b28-9203-49fa73674af7',
      terminalId: 'a7f90904-800f-4aef-b926-f0e0f3b65322',
      name: 'Terminal',
    };

    sandbox.stub(businessModel, 'findOne').returns(business);
    sandbox.stub(paymentCodeModel, 'findOne').returns(null);
    sandbox.stub(terminalModel, 'findOne').returns(terminalModel);
    sandbox.stub(terminalModel, 'populate').returns(terminal);

    const code = await paymentService.createPaymentCodeByBusiness(
      business,
      PaymentSource.externalApi,
      plainToClass(PaymentDto, {amount: 1500}),
    );

    expect(code.code).to.be.a('number');
  });
});
