import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AffiliateBrandingDto, AppWithAccessConfigDto } from '../dto';
import { AccessConfigModel, AffiliateBrandingModel } from '../models';
import { Model } from 'mongoose';
import { AffiliateBrandingSchemaName } from '../schemas';
import { BusinessModel } from '@pe/business-kit';
import { EventDispatcher } from '@pe/nest-kit';
import { AffiliateBrandingEventsEnum } from '../enums';
import { AccessConfigService } from './access-config.service';
import { ValidateAffiliateNameResponseInterface } from '../interfaces';
import { DomainHelper } from '../helpers';
import { AffiliatesBrandingQueryDto } from '../dto/affiliates-branding-query.dto';

@Injectable()
export class AffiliateBrandingsService {
  constructor(
    @InjectModel(AffiliateBrandingSchemaName) private readonly affiliateBrandingModel: Model<AffiliateBrandingModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly accessConfigService: AccessConfigService,
  ) { }

  public async getById(id: string)
  : Promise<AffiliateBrandingModel> {
    return this.affiliateBrandingModel.findOne({ _id: id });
  }

  public async getByBusiness(business: BusinessModel)
  : Promise<AffiliateBrandingModel[]> {
    return this.affiliateBrandingModel.find({ business: business._id });
  }

  public async getForAdmin(query: AffiliatesBrandingQueryDto): Promise<any> {

    const limit: number = +query.limit || 100;
    const page: number = +query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    const documents: any = await this.affiliateBrandingModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.affiliateBrandingModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async getDefault(business: BusinessModel)
  : Promise<AffiliateBrandingModel> {
    return this.affiliateBrandingModel.findOne({ business: business._id, isDefault: true });
  }

  public async appWithAccessConfig(
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<AppWithAccessConfigDto> {
    const accessConfig: AccessConfigModel = await this.accessConfigService.findOneByCondition({
      affiliateBranding: affiliateBranding,
    });
    await affiliateBranding.populate('business channelSet').execPopulate();

    return {
      ...affiliateBranding.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }

  public async setDefault(affiliateBrandingId: string, businessId: string): Promise<AffiliateBrandingModel> {

    await this.affiliateBrandingModel.updateMany(
      {
        business: businessId,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    return this.affiliateBrandingModel.findOneAndUpdate(
      {
        _id: affiliateBrandingId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
      {
        new: true,
      },
    );
  }

  public async create(business: BusinessModel, createAffiliateBrandingDto: AffiliateBrandingDto)
  : Promise<AffiliateBrandingModel> {
    const brandingNameAvailable: ValidateAffiliateNameResponseInterface = 
    await this.isBrandingNameAvailable(createAffiliateBrandingDto.name, business, null);

    if (!brandingNameAvailable.result) {
      const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      createAffiliateBrandingDto.name = createAffiliateBrandingDto.name + '-' + suffix;
    }

    const affiliateBranding: AffiliateBrandingModel = await this.affiliateBrandingModel.create({
      ...createAffiliateBrandingDto,
      business: business._id,
    });

    await this.eventDispatcher.dispatch(AffiliateBrandingEventsEnum.AffiliateBrandingCreated, affiliateBranding);

    return affiliateBranding;
  }

  public async update(
    branding: AffiliateBrandingModel,
    createAffiliateBrandingDto: AffiliateBrandingDto,
    business: BusinessModel,
  ): Promise<AffiliateBrandingModel> {

    if (createAffiliateBrandingDto.name) {
      const brandingNameAvailable: ValidateAffiliateNameResponseInterface = 
      await this.isBrandingNameAvailable(createAffiliateBrandingDto.name, business, branding.id);

      if (!brandingNameAvailable.result) {
        const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
        createAffiliateBrandingDto.name = createAffiliateBrandingDto.name + '-' + suffix;
      }
    }

    await this.affiliateBrandingModel.updateOne(        
      { _id: branding._id },
      {
        $set: {
          ...createAffiliateBrandingDto,
        },
      },      
    );
    
    const affiliateBranding: AffiliateBrandingModel = await this.affiliateBrandingModel.findOne(         
      { _id: branding._id },
    );

    await this.eventDispatcher.dispatch(AffiliateBrandingEventsEnum.AffiliateBrandingUpdated, affiliateBranding);

    return affiliateBranding;
  }

  public async delete(affiliateBranding: AffiliateBrandingModel): Promise<void> {
    await affiliateBranding.remove();
    await this.eventDispatcher.dispatch(AffiliateBrandingEventsEnum.AffiliateBrandingRemoved, affiliateBranding);
  }

  public async isBrandingNameAvailable(
    name: string,
    business: BusinessModel,
    brandingId: string,
  ): Promise<ValidateAffiliateNameResponseInterface> {
    if (!name) {
      return {
        message: 'Name must be not empty',
        result: false,
      };
    }

    if (await this.isNameOccupied(name, business, brandingId)) {
      return {
        message: `Affiliate branding with name "${name}" already exists for business: "${business.id}"`,
        result: false,
      };
    }

    const domain: string = DomainHelper.nameToDomain(name);

    if (await this.accessConfigService.isDomainOccupied(domain, brandingId)) {
      return {
        message: `Affiliate Branding with domain "${domain}" already exists"`,
        result: false,
      };
    }

    if (await this.accessConfigService.isInternalDomainOccupied(domain, brandingId)) {
      return {
        message: `Affiliate Branding with domain "${domain}" already exists"`,
        result: false,
      };
    }

    return {
      result: true,
    };
  }

  private async isNameOccupied(
    name: string,
    business: BusinessModel,
    brandingId: string,
  ): Promise<boolean> {
    const brandingByName: AffiliateBrandingModel = await this.affiliateBrandingModel.findOne({
      business: business._id,
      name: name,
    }).exec();

    return brandingByName && brandingByName.id !== brandingId;
  }
}
