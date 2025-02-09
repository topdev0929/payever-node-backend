import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RabbitMqClient } from '@pe/nest-kit';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import 'mocha';
import * as sinon from 'sinon';

import { CodeStatus, VerificationStep, VerificationType } from '../enum';
import { environment } from '../environments';
import { CodeVerifierService } from './code-verifier.service';
import { RabbitProducer } from './rabbit-producer.service';

describe('Code verificator service', () => {
  let sandbox;
  let codeVerificatorService: CodeVerifierService;

  const code = {
    save: () => null,
    updateAmount: () => null,
    checkAmount: () => null,

    flow: {
      amount: 13.2,
      payment: {
        id: '02112137-be51-4db7-b5a0-ffe509e65267',
        uuid: '02112137-be51-4db7-b5a0-ffe509e65267',
        paymentType: 'santander_installment_se',
      },
    },
    status: CodeStatus.accepted,
    log: {
      verificationType: VerificationType.verifyByPayment,
      verificationStep: VerificationStep.initialization,
      secondFactor: false,
    },
  };

  const paymentCodeModel = {
    findOne: async () => Promise.resolve(code),
    findOneBy: async () => Promise.resolve(code),
  };

  const client = { sendAsync: () => null } as unknown;
  const rabbitService = new RabbitProducer(client as RabbitMqClient);

  const deliveryService = {
    init: async () => Promise.resolve({}),
    deliver: async () => Promise.resolve({}),
  };

  before(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Logger,
        CodeVerifierService,
        {
          provide: 'DeliveryService',
          useValue: deliveryService,
        },
        {
          provide: 'PaymentCodeModel',
          useValue: paymentCodeModel,
        },
        {
          provide: 'RabbitService',
          useValue: rabbitService,
        },
      ],
    }).compile();

    const strategy = {
      type: VerificationType.verifyByPayment,
      step: VerificationStep.initialization,
      factor: false,

      supports: () => true,
      verify: async () => Promise.resolve({}),
    };

    codeVerificatorService = module.get<CodeVerifierService>(
      CodeVerifierService,
    );

    codeVerificatorService.addService(strategy);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  it('should verify a code', async () => {
    const dto = {
      merchant_id: '01a868d3-4ed5-4d96-bec9-df86957931fd',
      amount: 13.2,
      code: 123456,
      token: '',
    };

    const mock = new MockAdapter.default(axios);
    mock
      .onPost(
        environment.transactionsUrl +
          '/api/business/01a868d3-4ed5-4d96-bec9-df86957931fd/' +
          '02112137-be51-4db7-b5a0-ffe509e65267/action/shipping_goods',
      )
      .reply(200, []);

    await codeVerificatorService.verify(dto, '');
  });
});
