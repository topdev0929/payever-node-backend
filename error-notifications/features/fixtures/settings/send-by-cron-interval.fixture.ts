import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SettingsModel } from '../../../src/error-notifications/models';
import { SettingsSchemaName } from '../../../src/error-notifications/schemas';
import {
  CronUpdateIntervalEnum,
  ErrorNotificationTypesEnum,
  SendingMethodEnum,
  PaymentMethodsEnum,
} from '../../../src/error-notifications/enums';

const EN_ID_STORED_3_HOURS_AGO: string = '9ed558b5-a1dd-4bad-b774-08aa13c4ea69';
const EN_ID_STORED_5_HOURS_AGO: string = '2f29424e-5b1f-11eb-ae93-0242ac130002';
const EN_ID_STORED_30_MIN_AGO: string = '7a085ee5-1498-4399-9e61-618445c3b213';
const EN_ID_STORED_10_MIN_AGO: string = '87551f22-5bf8-11eb-ae93-0242ac130002';
const EN_ID_STORED_JUST_NOW: string = '97356abe-5bf8-11eb-ae93-0242ac130002';

class ApiKeyUpdate24hFixture extends BaseFixture {
  private readonly SettingsModel: Model<SettingsModel> = this.application.get(
    getModelToken(SettingsSchemaName),
  );

  public async apply(): Promise<void> {
    const Settings: any[] = [
      {
        _id: EN_ID_STORED_3_HOURS_AGO,
        businessId: EN_ID_STORED_3_HOURS_AGO,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.cash,
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: EN_ID_STORED_5_HOURS_AGO,
        businessId: EN_ID_STORED_5_HOURS_AGO,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.cash,
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: EN_ID_STORED_30_MIN_AGO,
        businessId: EN_ID_STORED_30_MIN_AGO,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.paypal,
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: EN_ID_STORED_10_MIN_AGO,
        businessId: EN_ID_STORED_10_MIN_AGO,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.pspApiFailed,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: EN_ID_STORED_JUST_NOW,
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.apiKeysInvalid,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
    ];

    await this.SettingsModel.create(Settings);
  }
}

export = ApiKeyUpdate24hFixture;
