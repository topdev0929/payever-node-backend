import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SiteModel } from '../models';
import { Model } from 'mongoose';
import { SiteEventDto } from '../dto';
import { SiteSchemaName } from '../schemas';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(SiteSchemaName) private readonly siteModel: Model<SiteModel>,
  ) { }

  public async createOrUpdateSiteFromEvent(data: SiteEventDto): Promise<SiteModel> {
    const businessId: string = data.business ? data.business.id : null;

    return this.siteModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          businessId,
          default: data.default,
          logo: data.logo,
          name: data.name,
          url: data.url,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteSite(data: SiteEventDto): Promise<void> {
    await this.siteModel.deleteOne({ _id: data.id }).exec();
  }

  public async getDefaultBusinessSite(businessId: string): Promise<SiteModel> {
    return this.siteModel.findOne({
      businessId,
    });
  }
}
