import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SettingsModel } from '../../../src/error-notifications/models';
import { SettingsSchemaName } from '../../../src/error-notifications/schemas';
import {
  CronUpdateIntervalEnum,
  ErrorNotificationTypesEnum,
  SendingMethodEnum,
} from '../../../src/error-notifications/enums';

const EN_ID_STORED_JUST_NOW: string = '97356abe-5bf8-11eb-ae93-0242ac130002';

class ApiKeyUpdate24hFixture extends BaseFixture {
  private readonly SettingsModel: Model<SettingsModel> = this.application.get(
    getModelToken(SettingsSchemaName),
  );

  public async apply(): Promise<void> {
    const Settings: any[] = [
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
