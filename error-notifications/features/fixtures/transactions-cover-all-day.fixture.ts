import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { TransactionModel } from '../../src/error-notifications/models';
import { TransactionSchemaName } from '../../src/error-notifications/schemas';
import { PaymentStatusesEnum, PaymentMethodsEnum } from '../../src/error-notifications';

const EN_ID_STORED_LAST_TR_TIME: string = 'bcee5dad-6cc4-4cf7-a9dc-57d3a5b2bba0';

class TransactionFixture extends BaseFixture {
  private readonly transactionModel: Model<TransactionModel> = this.application.get(
    getModelToken(TransactionSchemaName),
  );

  public async apply(): Promise<void> {
    const transactions: any[] = [
      {
        _id: 'e456278f-d32b-44c4-a7ab-4c27ae1524eb',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d4',
        paymentType: PaymentMethodsEnum.paypal,
        status: PaymentStatusesEnum.STATUS_ACCEPTED,
        updatedAt: new Date(),
      },
      {
        _id: '6c06a77f-00b5-441a-b2de-635ae47b0a70',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d4',
        paymentType: PaymentMethodsEnum.santanderDkInstallment,
        status: PaymentStatusesEnum.STATUS_ACCEPTED,
        updatedAt: new Date(),
      },
    ];

    await this.transactionModel.create(transactions);
  }
}

export = TransactionFixture;
