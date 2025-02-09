import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import {
  ChannelSetModel,
} from '@pe/channels-sdk';

import { CreateSiteDto, AdminSiteListDto } from '../dto';
import { SiteEventsEnum } from '../enums';
import { SiteDocument, SiteSchemaName } from '../schemas';
import type { Populated } from '../../common';
import { BusinessModel } from '../models';

@Injectable()
export class SitesRepository {
  constructor(
    @InjectModel(SiteSchemaName) private readonly siteModel: Model<SiteDocument>,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async findByBusiness(business: BusinessModel): Promise<SiteDocument[]> {
    return this.siteModel.find({
      businessId: business._id,
    }).populate('accessConfigDocument');
  }

  public async findById(siteId: string): Promise<Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument'>> {
    return this.siteModel.findOne({
      _id: siteId,
    }).populate('accessConfigDocument').populate('domainDocument') as any;
  }

  public async getDefault(business: BusinessModel): Promise<SiteDocument> {
    return this.siteModel.findOne(
      {
        businessId: business._id,
        isDefault: true,
      },
    ).populate('accessConfigDocument');
  }

  public async clone(
    business: BusinessModel,
    siteToClone: SiteDocument,
    channelSet: ChannelSetModel,
    dto: CreateSiteDto,
  ): Promise<SiteDocument> {
    const siteAssign: SiteDocument = Object.assign({ }, siteToClone.toObject(), dto) as SiteDocument;
    delete siteAssign._id;

    const site: SiteDocument = await this.siteModel.create({
      ...siteAssign,
      accessConfig: [],
      businessId: business._id,
      channelSet: channelSet,
      isDefault: false,
    });

    await site
    .populate('business')
    .populate('channelSetDocument')
    .execPopulate();

    await this.dispatcher.dispatch(SiteEventsEnum.SiteClone, site);
    await this.dispatcher.dispatch(SiteEventsEnum.SiteCreated, site);

    return site;
  }

  public async create(
    business: BusinessModel,
    channelSet: ChannelSetModel,
    createSiteDto: CreateSiteDto,
  ): Promise<SiteDocument> {
    const businessSites: SiteDocument[] = await this.findByBusiness(business);

    const site: SiteDocument = await this.siteModel.create({
      ...createSiteDto,
      accessConfig: [],
      businessId: business._id,
      channelSet: channelSet,
      domain: [],
      isDefault: !businessSites?.length,
    });

    await site
    .populate('business')
    .populate('channelSetDocument')
    .execPopulate();

    await this.dispatcher.dispatch(SiteEventsEnum.SiteCreated, site);

    return site;
  }

  public async isNameOccupied(name: string, business: BusinessModel, currentSiteId: string): Promise<boolean> {
    if (!name) {
      return false;
    }

    const nameRegex: string = name.replace(/([^a-zA-Z0-9-])/gm, `\\$1`);
    const siteByName: SiteDocument = await this.siteModel.findOne({
      businessId: business._id,
      name: new RegExp(`^${nameRegex}$`, 'i'),
    }).exec();

    return siteByName && siteByName.id !== currentSiteId;
  }

  public async update(site: SiteDocument, dto: Partial<SiteDocument>): Promise<SiteDocument> {
    await this.siteModel.updateOne({ _id: site._id }, dto).exec();

    const updatedSite: SiteDocument = await this.siteModel.findOne({
      _id: site._id,
    }).exec();

    await updatedSite
    .populate('business')
    .populate('channelSetDocument')
    .execPopulate();

    await this.dispatcher.dispatch(SiteEventsEnum.SiteUpdated, site, updatedSite);

    return updatedSite;
  }

  public async resetDefault(business: BusinessModel): Promise<void> {
    await this.siteModel.updateMany({ businessId: business._id }, { isDefault: false }).exec();
  }

  public async delete(site: SiteDocument, deleteTestData: boolean = false): Promise<void> {
    const deletedSite: SiteDocument = await this.siteModel.findOne({
      _id: site._id,
    }).exec();

    await deletedSite
    .populate('business')
    .populate('channelSetDocument')
    .execPopulate();

    await this.siteModel.findOneAndDelete({ _id: site._id }).exec();

    await this.dispatcher.dispatch(SiteEventsEnum.SiteRemoved, deletedSite, deleteTestData);
  }

  public async countForBusiness(business: BusinessModel): Promise<number> {
    return this.siteModel.countDocuments({ businessId: business._id });
  }

  public async getForAdmin(query: AdminSiteListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const documents: SiteDocument[] = await this.siteModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total: number = await this.siteModel.count().exec();

    return {
      documents,
      page,      
      total,
    };
  }

  public async findByBusinessIds(businessIds: string[]): Promise<SiteDocument[]> {
    return this.siteModel.find({ businessId: { $in :  businessIds } });
  }

  public async findInactiveByBusinessId(businessId: string): Promise<SiteDocument[]> {
    return this.siteModel.find({
      businessId: businessId,
      isDefault: { $ne: true },
    });
  }

  public async findInactive(): Promise<SiteDocument[]> {
    return this.siteModel.find({
      isDefault: { $ne: true },
    });
  }
}
