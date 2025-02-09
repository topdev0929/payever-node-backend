import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessStepModel, DefaultStepModel } from '../models';
import { BusinessStepSchemaName } from '../schemas';
import { SectionsEnum } from '../enums';
import { BusinessModel } from '../../models/business.model';

@Injectable()
export class BusinessStepService {
  constructor(
    @InjectModel(BusinessStepSchemaName) private readonly businessStepModel: Model<BusinessStepModel>,
  ) {  }

  public async getListForSection(section: SectionsEnum, business: BusinessModel): Promise<BusinessStepModel[]> {
    return this.businessStepModel.find({
      businessId: business.id,
      section,
    });
  }

  public async setActive(step: BusinessStepModel, business: BusinessModel): Promise<BusinessStepModel> {
    await this.businessStepModel.updateMany(
      {
        businessId: business.id,
        section: step.section,
      },
      {
        $set: {
          isActive: false,
        },
      },
    );

    return this.businessStepModel.findOneAndUpdate(
      { _id: step.id },
      { isActive: true },
      { new: true },
    );
  }

  public async createStepsForBusiness(
    business: BusinessModel,
    section: string,
    steps: DefaultStepModel[],
  ): Promise<void> {
    for (const step of steps) {
      await this.businessStepModel.create(
        {
          businessId: business.id,
          isActive: step.order === 1,
          section: section,
          step: step.id,
        } as BusinessStepModel,
      );
    }
  }

  public async deleteStepsForBusiness(business: BusinessModel): Promise<void> {
    await this.businessStepModel.deleteMany({
      businessId: business.id,
    });
  }
}
