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

const EN_ID_STORED_JUST_NOW: string = '97356abe-5bf8-11eb-ae93-0242ac130002';

class ApiKeyUpdateNeverFixture extends BaseFixture {
  private readonly SettingsModel: Model<SettingsModel> = this.application.get(
    getModelToken(SettingsSchemaName),
  );

  public async apply(): Promise<void> {
    const Settings: any[] = [
      {
        _id: 'd28397a2-60a4-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        isEnabled: true,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type: ErrorNotificationTypesEnum.apiKeysInvalid,
        updateInterval: CronUpdateIntervalEnum.never,
        updatedAt: new Date(),
      },
      {
        _id: 'd5cd835a-60a4-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        integration: PaymentMethodsEnum.paypal,
        isEnabled: true,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updateInterval: CronUpdateIntervalEnum.never,
        updatedAt: new Date(),
      },

    ];

    await this.SettingsModel.create(Settings);
  }
}

export = ApiKeyUpdateNeverFixture;
