import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { EmployeeSettingSchemaName } from '../schemas';
import { EmployeeSettings } from '../interfaces';
import { DEAFULT_EMPLOYEE_TOKEN_EXPIRY_HOURS } from '../constants';

@Injectable()
export class EmployeeSettingsService {
  constructor(
    @InjectModel(EmployeeSettingSchemaName) private readonly employeeSettingsModel: Model<EmployeeSettings>,
  ) { }
  
  public async createEmployeeSettings(
    businessId: string,
    expiryHours: number,
  ): Promise<EmployeeSettings> {
    return this.employeeSettingsModel.create({
      businessId,
      expiryHours,
    });
  }
  
  public async upsertEmployeeSettings(
    businessId: string,
    expiryHours: number,
  ): Promise<EmployeeSettings> {
    return this.employeeSettingsModel.findOneAndUpdate(
      {
        businessId,
      },
      {
        $set: {
          businessId,
          expiryHours,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  public async getExpiryHoursByBusinessId(
    businessId: string,
  ): Promise<number> {
    let settings: EmployeeSettings = await this.employeeSettingsModel.findOne({
      businessId,
    });

    if (!settings) {
      settings = await this.createEmployeeSettings(businessId, DEAFULT_EMPLOYEE_TOKEN_EXPIRY_HOURS);
    }

    return settings.expiryHours;
  }
}
