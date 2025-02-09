import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessConfigSchemaName } from '../schemas';
import { AccessConfigModel } from '../models';

@Injectable()
export class AccessConfigService {
  constructor(
    @InjectModel(AccessConfigSchemaName) private readonly accessConfigModel: Model<AccessConfigModel>,
  ) {
  }

  public async getByAppIdOrCreate(applicationId: string): Promise<AccessConfigModel> {
    let accessConfig: AccessConfigModel = await this.accessConfigModel.findOne({ application: applicationId});
    if (!accessConfig) {
      accessConfig = await this.accessConfigModel.create(
        {
          application: applicationId,
        },
      );
    }

    return accessConfig;
  }

  public async setLive(applicationId: string): Promise<void> {
    await this.accessConfigModel.findOneAndUpdate(
      {
        application: applicationId,
      },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async updateById(
    accessConfigId: string,
    dto: any,
  ): Promise<AccessConfigModel> {
    return this.accessConfigModel.findByIdAndUpdate(
      accessConfigId,
      { $set: dto },
      { new: true },
    );
  }
}
