import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AffiliateDto, BusinessAffiliateQueryDto } from '../dto';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { AffiliatesService } from './affiliates.service';
import { AffiliateModel, BusinessAffiliateModel } from '../models';
import { Model } from 'mongoose';
import { BusinessAffiliateSchemaName } from '../schemas';
import { EventDispatcher } from '@pe/nest-kit';
import { EntityExistsException } from '../../exceptions';
import { BusinessAffiliatesEventEnum } from '../enums';
import { AdminBusinessAffiliateDto } from '../dto/admin-business-affiliate.dto';

@Injectable()
export class BusinessAffiliatesService {
  constructor(
    @InjectModel(BusinessAffiliateSchemaName) private readonly businessAffiliateModel: Model<BusinessAffiliateModel>,
    private readonly affiliatesService: AffiliatesService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessService: BusinessService,
  ) { }

  public async updateForAdmin(businessAffilateId: string, businessAffiliateDto: AdminBusinessAffiliateDto)
    : Promise<BusinessAffiliateModel> {
    try {
      const affiliate: AffiliateModel = await this.affiliatesService.findOrCreate(businessAffiliateDto.affiliate);
      await this.businessAffiliateModel.findByIdAndUpdate(businessAffilateId, {
        affiliate,
        businessId: businessAffiliateDto.businessId,
      });
      const updated: BusinessAffiliateModel = await this.businessAffiliateModel.findById(businessAffilateId);
      await updated.populate('business').populate('affiliate').execPopulate();
      await this.eventDispatcher.dispatch(BusinessAffiliatesEventEnum.BusinessAffiliateCreated, updated);

      return updated;
    } catch (e) {
      if (e.code === 11000) {
        throw new EntityExistsException(`Business affiliate "${businessAffiliateDto.affiliate.email}" already exists`);
      }

      throw e;
    }
  }

  public async createForAdmin(businessAffiliateDto: AdminBusinessAffiliateDto)
    : Promise<BusinessAffiliateModel> {
    const business: BusinessModel = await this.getBusinessById(businessAffiliateDto.businessId);

    return this.create(business, businessAffiliateDto.affiliate);
  }

  public async create(business: BusinessModel, createAffiliateDto: AffiliateDto): Promise<BusinessAffiliateModel> {
    try {
      const affiliate: AffiliateModel = await this.affiliatesService.findOrCreate(createAffiliateDto);

      const created: BusinessAffiliateModel = await this.businessAffiliateModel.create({
        affiliate,
        businessId: business._id,
      });

      await created.populate('business').execPopulate();

      await this.eventDispatcher.dispatch(BusinessAffiliatesEventEnum.BusinessAffiliateCreated, created);

      return created;
    } catch (e) {
      if (e.code === 11000) {
        throw new EntityExistsException(`Business affiliate "${createAffiliateDto.email}" already exists`);
      }

      throw e;
    }
  }


  public async get(business: BusinessModel): Promise<BusinessAffiliateModel[]> {
    return this.businessAffiliateModel.find({
      businessId: business._id,
    });
  }

  public async getByBusinessAndAffiliate(business: BusinessModel, affiliate: AffiliateModel)
    : Promise<BusinessAffiliateModel> {
    return this.businessAffiliateModel.findOne({
      businessId: business._id,
      affiliate: affiliate._id,
    });
  }

  public async getForAdmin(query: BusinessAffiliateQueryDto): Promise<any> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = {};

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    const documents: any = await this.businessAffiliateModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.businessAffiliateModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async delete(businessAffiliate: BusinessAffiliateModel): Promise<void> {
    await businessAffiliate.populate('affiliate').execPopulate();
    await this.businessAffiliateModel.deleteOne({ _id: businessAffiliate._id });

    await this.eventDispatcher.dispatch(BusinessAffiliatesEventEnum.BusinessAffiliateRemoved, businessAffiliate);
  }

  private async getBusinessById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) { throw new NotFoundException(`business with id:'${businessId}' does not exist`); }

    return business;
  }
}
