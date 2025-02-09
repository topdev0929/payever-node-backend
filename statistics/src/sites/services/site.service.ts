import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SiteModel } from '../interfaces/entities';
import { Model } from 'mongoose';
import { SiteSchemaName } from '../schemas';
import { CreateSiteDto } from '../dto';
import { DomainUpdateDto } from '../dto/domain-update.dto';
import { SetDefaultSiteDto } from '../dto/set-default-site.dto';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(SiteSchemaName) private readonly siteModel: Model<SiteModel>,
  ) { }

  public async create(
    dto: CreateSiteDto,
  ): Promise<SiteModel> {
    return  this.upsert(dto);
  }

  public async removeById(siteId: string): Promise<SiteModel> {
    return this.siteModel.findOneAndDelete({ _id: siteId });
  }

  public async upsert(dto: CreateSiteDto): Promise<SiteModel> {
    return this.siteModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: {
          business: dto.business.id as any,
          ...dto.domain && {
            domain: dto.domain,
          },
          isDefault: dto.default,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async updateDomain(dto: DomainUpdateDto): Promise<SiteModel> {
    return this.siteModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: {
          domain: dto.newDomain,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async getDefaultSiteByBusiness(business: string): Promise<SiteModel> {
    return this.siteModel.findOne({
      business,
      isDefault: true,
    });
  }

  public async setDefaultSite(dto: SetDefaultSiteDto): Promise<SiteModel> {
    const defSite: SiteModel = await this.getDefaultSiteByBusiness(dto.businessId);
    defSite.isDefault = false;
    await defSite.save();

    return this.siteModel.findOneAndUpdate(
      {
        _id: dto.siteId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
    );
  }
}
