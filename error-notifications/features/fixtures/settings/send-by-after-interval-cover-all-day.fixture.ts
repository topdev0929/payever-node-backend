import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SettingsModel } from '../../../src/error-notifications/models';
import { SettingsSchemaName } from '../../../src/error-notifications/schemas';
import {
  ErrorNotificationTypesEnum,
  SendingMethodEnum,
  PaymentMethodsEnum,
} from '../../../src/error-notifications/enums';

const EN_ID_STORED_LAST_TR_TIME: string = 'bcee5dad-6cc4-4cf7-a9dc-57d3a5b2bba0';

class SendByAfterIntervalFixture extends BaseFixture {
  private readonly SettingsModel: Model<SettingsModel> = this.application.get(
    getModelToken(SettingsSchemaName),
  );

  public async apply(): Promise<void> {
    const Settings: any[] = [
      {
        _id: '6d9c8963-6d4f-42df-9e95-d7a52206a63e',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.paypal,
        isEnabled: true,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        timeFrames: [
          {
            startDayOfWeek: 1,
            startHour: 8,
            startMinutes: 0,

            endDayOfWeek: 7,
            endHour: 8,
            endMinutes: 0,

            repeatFrequencyInterval: 0,
            sendEmailAfterInterval: 1,
          },
        ],
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: '317d2467-684e-47d3-8aac-da6429ed793b',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.santanderDkInstallment,
        isEnabled: true,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        timeFrames: [
          {
            startDayOfWeek: 1,
            startHour: 8,
            startMinutes: 0,

            endDayOfWeek: 7,
            endHour: 8,
            endMinutes: 1,

            repeatFrequencyInterval: 0,
            sendEmailAfterInterval: 1,
          },
        ],
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
    ];

    await this.SettingsModel.create(Settings);
  }
}

export = SendByAfterIntervalFixture;
