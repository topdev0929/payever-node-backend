import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsSchemaName } from '../schemas';
import { SettingsModel } from '../models';
import { DefaultSettingsDto, SettingsDto, UpdateSettingsDto } from '../dto';
import { CronUpdateIntervalEnum, ErrorNotificationTypesEnum, SendingMethodEnum } from '../enums';
import { DefaultSettings } from '../config';
import {
  IntegrationRelatedErrorTypes,
  SendingByCronUpdateIntervalErrorTypes,
  SendingByAfterIntervalErrorTypes,
} from '../constants';
import { DefaultSettingsInterface, SettingsInterface } from '../interfaces';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SettingsSchemaName) private readonly settingsModel: Model<SettingsModel>,
  ) {
  }

  public async create(dto: SettingsDto): Promise<SettingsModel> {
    return this.settingsModel.create(dto);
  }

  public async update(settings: SettingsModel, dto: SettingsDto): Promise<SettingsModel> {
    return this.settingsModel.findOneAndUpdate(
      {
        _id: settings.id,
      },
      {
        $set: dto,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  public async getSettingsByParamsModel(
    businessId: string,
    type: ErrorNotificationTypesEnum,
    integration?: string,
  ): Promise<SettingsModel> {
    let settingsItem: SettingsModel;
    if (IntegrationRelatedErrorTypes.includes(type) ) {
      settingsItem = await this.settingsModel.findOne({
        businessId: businessId,
        integration,
        type: type,
      });
    } else {
      settingsItem = await this.settingsModel.findOne({
        businessId: businessId,
        type,
      });
    }

    return settingsItem;
  }

  public async getSettingsByParams(
    businessId: string,
    type: ErrorNotificationTypesEnum,
    integration?: string,
  ): Promise<SettingsDto> {
    const settingsItem: SettingsModel = await this.getSettingsByParamsModel(businessId, type, integration);

    if (!settingsItem) {
      let defSetting: DefaultSettingsInterface =
        DefaultSettings.find(
          (item: DefaultSettingsDto) => {
            return integration ? item.type === type && item.integration === integration : item.type === type;
          },
        );

      if (!defSetting) {
        defSetting = this.getDefaultSettingsForType(type);
      }

      return {
        businessId,
        integration,
        type,
        ...defSetting,
      };
    } else {

      return settingsItem;
    }
  }

  public async getSettingsByBusiness(
    businessId: string,
  ): Promise<SettingsDto[]> {
    const storedSettings: SettingsInterface[] = await this.settingsModel.find({ businessId: businessId});

    for ( const defaultItem of DefaultSettings) {
      const storedItem: SettingsInterface = storedSettings.find(
        (item: SettingsInterface) => {
          return IntegrationRelatedErrorTypes.includes(defaultItem.type) ?
            item.type === defaultItem.type && item.integration === defaultItem.integration :
            item.type === defaultItem.type;
        });

      if (!storedItem) {
        storedSettings.push({
          businessId,
          ...defaultItem,
        });
      }
    }

    return storedSettings;
  }

  public async getStoredSettingsByBusiness(
    businessId: string,
    type: ErrorNotificationTypesEnum,
    integration?: string,
  ): Promise<SettingsDto> {
    return this.settingsModel.findOne(
      {
        businessId: businessId,
        integration,
        type: type,
      },
    );
  }

  public async getSettingsByReminderOption(): Promise<SettingsModel[]> {
    return this.settingsModel.find({
      'repeatFrequencyInterval': { '$gt': 0},
    });
  }

  public async saveSettingsByParams(
    businessId: string,
    type: ErrorNotificationTypesEnum,
    integration: string,
    updateSettings: UpdateSettingsDto,
  ): Promise<SettingsModel> {
    const updatedDto: SettingsDto = {
      businessId,
      integration,
      type,
      ...updateSettings,
    };

    const settingsItem: SettingsModel = await this.getSettingsByParamsModel(businessId, type, integration);
    if (settingsItem) {
      return this.update(settingsItem, updatedDto);
    } else {
      return this.create(updatedDto);
    }
  }

  public async disableSettingsForIntegration(
    businessId: string,
    integration: string,
  ): Promise<void> {
    const settings: SettingsModel[] = await this.settingsModel.find(
      {
        businessId: businessId,
        integration,
      },
    );

    for (const setting of settings) {
      setting.isEnabled = false;

      await this.settingsModel.findByIdAndUpdate(setting.id, setting);
    }
  }

  private getDefaultSettingsForType(type: ErrorNotificationTypesEnum): DefaultSettingsInterface {
    if (SendingByCronUpdateIntervalErrorTypes.includes(type)) {
      return {
        isEnabled: false,
        repeatFrequencyInterval: 0,
        sendingMethod: SendingMethodEnum.sendByCronInterval,
        type,
        updateInterval: CronUpdateIntervalEnum.every5minutes,
      };
    }
    if (SendingByAfterIntervalErrorTypes.includes(type)) {
      return {
        isEnabled: false,
        sendingMethod: SendingMethodEnum.sendByAfterInterval,
        timeFrames: [],
        type,
      };
    }
  }
}
