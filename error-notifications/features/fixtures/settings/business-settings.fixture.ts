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

const BUSINESS_SETTINGS_ID: string = '6111e145-fb5e-4098-ae0c-ad51ea92fa64';
const BUSINESS_SETTINGS_PAYPAL_CRON: string = 'fe4f1cd0-71d9-11eb-9439-0242ac130002';
const BUSINESS_SETTINGS_PAYPAL_AFTER: string = '6d9c8963-6d4f-42df-9e95-d7a52206a63e';
const BUSINESS_SETTINGS_SANTANDER_CRON: string = '23c7752a-71da-11eb-9439-0242ac130002';
const BUSINESS_SETTINGS_SANTANDER_AFTER: string = '27b47d5e-71da-11eb-9439-0242ac130002';

class ApiKeyUpdate24hFixture extends BaseFixture {
  private readonly SettingsModel: Model<SettingsModel> = this.application.get(
    getModelToken(SettingsSchemaName),
  );

  public async apply(): Promise<void> {
    const Settings: any[] = [
      {
        _id: BUSINESS_SETTINGS_PAYPAL_CRON,
        businessId: BUSINESS_SETTINGS_ID,
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
        _id: BUSINESS_SETTINGS_PAYPAL_AFTER,
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.paypal,
        isEnabled: true,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        timeFrames: [
          {
            startDayOfWeek: 1,
            startHour: 0,
            startMinutes: 0,

            endDayOfWeek: 7,
            endHour: 23,
            endMinutes: 59,

            repeatFrequencyInterval: 60,
            sendEmailAfterInterval: 60,
          },
        ],
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: 'ab70482d-fea8-43a8-8643-226ca728cbc9',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.cash,
        isEnabled: true,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        timeFrames: [
          {
            startDayOfWeek: 1,
            startHour: 0,
            startMinutes: 0,

            endDayOfWeek: 7,
            endHour: 23,
            endMinutes: 59,

            repeatFrequencyInterval: 60,
            sendEmailAfterInterval: 60,
          },
        ],
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: BUSINESS_SETTINGS_SANTANDER_CRON,
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.santanderDeFactoring,
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: BUSINESS_SETTINGS_SANTANDER_AFTER,
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.santanderDeFactoring,
        isEnabled: true,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        timeFrames: [
          {
            startDayOfWeek: 1,
            startHour: 0,
            startMinutes: 0,

            endDayOfWeek: 7,
            endHour: 23,
            endMinutes: 59,

            repeatFrequencyInterval: 60,
            sendEmailAfterInterval: 60,
          },
        ],
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: '1b163905-a91c-4c0c-ac86-fd689eeee0ad',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.pspApiFailed,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: '6f493246-2116-4468-a421-c69fe21c5cdb',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.paypal,
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: '624c7f54-2f6e-4d12-bb68-bd2371f2eda6',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.thirdPartyError,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: 'a5c2dfbe-5fa9-4453-832d-0f37b8f23cc2',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.apiKeysInvalid,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
      {
        _id: '447a3e40-91bb-42db-bf67-b5bc3b3b5ca2',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updateInterval: CronUpdateIntervalEnum.every24Hours,
        updatedAt: new Date(),
      },
    ];

    await this.SettingsModel.create(Settings);
  }
}

export = ApiKeyUpdate24hFixture;
