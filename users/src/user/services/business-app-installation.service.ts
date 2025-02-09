import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessAppInstallationSchemaName } from '../schemas/business-app-installation.schema';
import { Model } from 'mongoose';
import { BusinessAppInstallationModel } from '../models';

@Injectable()
export class BusinessAppInstallationService {
  constructor(
    @InjectModel(BusinessAppInstallationSchemaName) private readonly model: Model<BusinessAppInstallationModel>,
  ) { }
  
  public async save(businessId: string, code: string): Promise<BusinessAppInstallationModel> {
    return this.model.findOneAndUpdate(
      {
        businessId,
        code,
      },
      {
        code,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async getListByBusinessId(businessId: string): Promise<BusinessAppInstallationModel[]> {
    return this.model.find({
      businessId,
    });
  }

  public async remove(businessId: string, code: string): Promise<BusinessAppInstallationModel> {
    return this.model.findOneAndDelete(
      {
        businessId,
        code,
      },
    );
  }
}
