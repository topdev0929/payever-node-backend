import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SettingsModel } from '../../../src/error-notifications/models';
import { SettingsSchemaName } from '../../../src/error-notifications/schemas';
import {
  CronUpdateIntervalEnum,
  ErrorNotificationTypesEnum,
  PaymentMethodsEnum,
  SendingMethodEnum,
} from '../../../src/error-notifications/enums';

const EN_ID_STORED_30_MIN_AGO: string = '7a085ee5-1498-4399-9e61-618445c3b213';
const EN_ID_STORED_10_MIN_AGO: string = '87551f22-5bf8-11eb-ae93-0242ac130002';
const EN_ID_STORED_JUST_NOW: string = '97356abe-5bf8-11eb-ae93-0242ac130002';

class ApiKeyUpdate5mFixture extends BaseFixture {
  private readonly SettingsModel: Model<SettingsModel> = this.application.get(
    getModelToken(SettingsSchemaName),
  );

  public async apply(): Promise<void> {
    const Settings: any[] = [
      {
        _id: '6d9c8963-6d4f-42df-9e95-d7a52206a63e',
        businessId: EN_ID_STORED_30_MIN_AGO,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.paypal,
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updateInterval: CronUpdateIntervalEnum.everyHour,
        updatedAt: new Date(),
      },
      {
        _id: '2d4ef1ce-5ef5-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_10_MIN_AGO,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.pspApiFailed,
        updateInterval: CronUpdateIntervalEnum.everyHour,
        updatedAt: new Date(),
      },
      {
        _id: '3126652a-5ef5-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.apiKeysInvalid,
        updateInterval: CronUpdateIntervalEnum.everyHour,
        updatedAt: new Date(),
      },
    ];

    await this.SettingsModel.create(Settings);
  }
}

export = ApiKeyUpdate5mFixture;
