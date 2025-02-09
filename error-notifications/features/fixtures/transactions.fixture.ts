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
        _id: 'ead92ff6-f14a-4b78-809e-b9ddb046345f',
        businessId: '6111e145-fb5e-4098-ae0c-ad51ea92fa64',
        originalId: '6176c9199ab3a651516c09d2',
        paymentType: 'paypal',
        status: 'STATUS_ACCEPTED',
        updatedAt: '2021-09-20T09:49:36.000Z',
      },



      {
        _id: 'dc04680a-4d35-46f1-969f-161db3fd29b4',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d3',
        paymentType: PaymentMethodsEnum.santanderSeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-10T09:49:36.000Z',
      },
      {
        _id: 'e456278f-d32b-44c4-a7ab-4c27ae1524eb',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d4',
        paymentType: PaymentMethodsEnum.santanderSeInstallment,
        status: PaymentStatusesEnum.STATUS_ACCEPTED,
        updatedAt: '2021-09-12T09:49:36.000Z',
      },
      {
        _id: 'dea4f323-b962-43a7-b4e2-65945ce227b0',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d5',
        paymentType: PaymentMethodsEnum.santanderSeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-13T09:49:36.000Z',
      },
      {
        _id: '3299b0c9-41b3-47fc-9c7d-844df852d0b3',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c01d5',
        paymentType: PaymentMethodsEnum.santanderSeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-14T09:49:36.000Z',
      },
      {
        _id: '74ff881d-592d-45df-805a-4b15c9321da9',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c02d5',
        paymentType: PaymentMethodsEnum.santanderSeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-15T09:49:36.000Z',
      },



      {
        _id: '4c7d3e57-70db-428b-b71f-d0200ff3fa5c',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d6',
        paymentType: PaymentMethodsEnum.santanderDeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-10T09:49:36.000Z',
      },
      {
        _id: '80c7e870-9a7a-4472-acb1-19dd8ade921d',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d7',
        paymentType: PaymentMethodsEnum.santanderDeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-12T09:49:36.000Z',
      },
      {
        _id: 'abf7010d-0085-4c7b-824f-eb2a1977d8b5',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d8',
        paymentType: PaymentMethodsEnum.santanderDeInstallment,
        status: PaymentStatusesEnum.STATUS_DECLINED,
        updatedAt: '2021-09-13T09:49:36.000Z',
      },
      {
        _id: '03cb64c8-d0ce-4cc6-b3c6-ae9a4b55111c',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        originalId: '6176c9199ab3a651516c09d9',
        paymentType: PaymentMethodsEnum.santanderDeInstallment,
        status: PaymentStatusesEnum.STATUS_ACCEPTED,
        updatedAt: '2021-09-14T09:49:36.000Z',
      },
    ];

    await this.transactionModel.create(transactions);
  }
}

export = TransactionFixture;
