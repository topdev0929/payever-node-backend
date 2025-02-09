import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModelLocal } from '../../business';
import { BusinessQueryDto } from '../dto';


@Injectable()
export class BusinessServiceLocal {

  constructor(
    @InjectModel('Business')
    private readonly businessModel: Model<BusinessModelLocal>,
  ) { }

  public async getForAdmin(
    query: BusinessQueryDto,
  ): Promise<{ documents: BusinessModelLocal[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: -1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    const documents: BusinessModelLocal[] = await this.businessModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.businessModel.countDocuments(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async addExcludedIntegrations(
    business: BusinessModelLocal,
    excludedIntegrationsIds: string[],
  ): Promise<BusinessModelLocal> {

    business.excludedIntegrations = [...new Set([ // unique merge
      ...business.excludedIntegrations,
      ...excludedIntegrationsIds,
    ])];

    await this.businessModel.findByIdAndUpdate(business._id, {
      $set: {
        excludedIntegrations: business.excludedIntegrations,
      },
    });

    return this.businessModel.findById(business._id);
  }

  public async removeExcludedIntegrations(
    business: BusinessModelLocal,
    excludedIntegrationsIds: string[],
  ): Promise<BusinessModelLocal> {

    if (!business.excludedIntegrations || business.excludedIntegrations.length === 0) {
      return business;
    }

    business.excludedIntegrations = business.excludedIntegrations.filter(
      (integrationId: string) => excludedIntegrationsIds.indexOf(integrationId) === -1,
    );

    await this.businessModel.findByIdAndUpdate(business._id, {
      $set: {
        excludedIntegrations: business.excludedIntegrations,
      },
    });

    return this.businessModel.findById(business._id);
  }

}
