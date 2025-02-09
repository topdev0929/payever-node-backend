import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { CodeStatus, PaymentSource, VerificationStep, VerificationType } from '../../src/enum';
import { PaymentCode } from '../../src/interfaces';
import { PaymentCodeSchemaName } from '../../src/schemas';

class CodesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<PaymentCode> = this.application.get(
      getModelToken(PaymentCodeSchemaName),
    );

    await model.create({
      _id: 'd9793a20-9bdd-4140-9d33-9b3e208f20e2',
      checkoutId: '0c6264e6-c978-4769-8c62-626fe949a4f2',
      code: 123456,
      flow: {
        amount: 500,
        billingAddress: {
          phone: '+79528224321',
        },
        businessId: '21e67ee2-d516-42e6-9645-46765eadd0ac',
        channelSetId: '5eab0f55-e055-4b1c-9772-96f7d11a7f3d',
        id: 'f74a39e21811682c89eedf64df58a7bc',
        payment: {
          id: 'f810171827e3923a6d3c2ec2d4f0950a',
          paymentType: 'santander_installment',
          uuid: '9a46902d-3d6e-46b9-93b6-cf964124e420',
        },
      },
      log: {
        paymentFlows: [],
        source: PaymentSource.autoresponder,
        verificationType: VerificationType.verifyByPayment,
      },
      status: CodeStatus.accepted,
      applicationId: '2abc895c-8f6e-4bf8-86e9-c66e6a1fc233',
    });

    await model.create({
      _id: 'be97294f-7c87-44f5-98c2-6c7f8bb84641',
      checkoutId: '0c6264e6-c978-4769-8c62-626fe949a4f2',
      code: 98765,
      flow: {
       amount: 500,
       billingAddress: {
         phone: '+79528224321',
       },
       businessId: '21e67ee2-d516-42e6-9645-46765eadd0ac',
       channelSetId: '5eab0f55-e055-4b1c-9772-96f7d11a7f3d',
       id: 'f74a39e21811682c89eedf64df58a7bc',
       payment: {
         id: 'f810171827e3923a6d3c2ec2d4f0950a',
         paymentType: 'santander_installment',
         uuid: '9a46902d-3d6e-46b9-93b6-cf964124e420',
       },
      },
      log: {
        paymentFlows: [],
        secondFactor: true,
        source: PaymentSource.autoresponder,
        verificationStep: VerificationStep.confirmation,
        verificationType: VerificationType.verifyById,

      },
      status: CodeStatus.accepted,
      applicationId: '2abc895c-8f6e-4bf8-86e9-c66e6a1fc233',
    });
  }
}

export = CodesFixture;
