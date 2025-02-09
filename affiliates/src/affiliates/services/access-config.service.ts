import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as dns from 'dns';
import { UpdateAccessConfigDto } from '../dto';
import { DomainCheckInterface } from '../interfaces';
import { AccessConfigSchemaName } from '../schemas';
import { AccessConfigModel, AffiliateBrandingModel } from '../models';
import { environment } from '../../environments';
import { DomainHelper } from '../helpers';
@Injectable()
export class AccessConfigService {
  private payeverIP: string;
  private payeverCNAME: string;

  constructor(
    @InjectModel(AccessConfigSchemaName) 
    private readonly affiliateBrandingAccessConfigsModel: Model<AccessConfigModel>,
  ) {
    this.payeverCNAME = environment.payeverCNAME;
    this.payeverIP = environment.payeverIP;
  }

  public async getByDomain(domain: string): Promise<AccessConfigModel> {
    const affiliatesDomain: string = environment.affiliatesDomain;

    const condition: FilterQuery<AccessConfigModel> = affiliatesDomain && domain.endsWith(affiliatesDomain)
      ? { internalDomain: domain.replace('.' + affiliatesDomain, '') }
      : { ownDomain: domain };

    return this.affiliateBrandingAccessConfigsModel.findOne(condition);
  }

   public async checkStatus(accessConfig: AccessConfigModel): Promise<DomainCheckInterface> {

    let cnames: string[] = [];
    try {
      cnames = await dns.promises.resolveCname(accessConfig.ownDomain);
    } catch (e) {
    }
    const lookupAddress: dns.LookupAddress = await dns.promises.lookup(accessConfig.ownDomain);
    const status: boolean = lookupAddress.address === this.payeverIP;

    return {
      cnames: cnames,
      currentCname: status ? this.payeverCNAME : '',
      currentIp: lookupAddress.address,
      isConnected: status,
      requiredCname: this.payeverCNAME,
      requiredIp: this.payeverIP,
    };
  }

  public async findOrCreate(affiliateBranding: AffiliateBrandingModel): 
  Promise<AccessConfigModel> { 
    const oldAccessConfig: AccessConfigModel = await this.affiliateBrandingAccessConfigsModel.findOne({
      affiliateBranding: affiliateBranding._id,
      business: affiliateBranding.business as string,
    });   

    if (!oldAccessConfig) {
      return this.create(affiliateBranding, { });
    }

    return oldAccessConfig;
  }

  public async createOrUpdate(
    affiliateBranding: AffiliateBrandingModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    const oldAccessConfig: AccessConfigModel = await this.affiliateBrandingAccessConfigsModel.findOne({
      affiliateBranding: affiliateBranding._id,
      business: affiliateBranding.business as string,
    });

    return !oldAccessConfig
      ? this.create(affiliateBranding, dto)
      : this.update(oldAccessConfig, dto);
  }

  public async setLive(affiliateBrandingId: string): Promise<void> {
    await this.affiliateBrandingAccessConfigsModel.findOneAndUpdate(
      {
        affiliateBranding: affiliateBrandingId,
      },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async getIsLive(businessId: string, affiliateBrandingId: string): Promise<boolean> {
    const currentAccessConfig: AccessConfigModel 
    = await this.affiliateBrandingAccessConfigsModel.findOne(
      { 
        affiliateBranding: affiliateBrandingId,
        business: businessId,
      },
    );

    return currentAccessConfig.isLive;
  }

  public async findOneByCondition(
    condition: FilterQuery<AccessConfigModel>,
  ): Promise<AccessConfigModel> {
    return this.affiliateBrandingAccessConfigsModel.findOne(condition);
  }

  public async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: AccessConfigModel = await this.affiliateBrandingAccessConfigsModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config;
  }

  public async isDomainOccupied(domain: string, brandingId: string): Promise<boolean> {
    const config: AccessConfigModel = await this.affiliateBrandingAccessConfigsModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.affiliateBranding !== brandingId;
  }

  public async isInternalDomainOccupied(domain: string, brandingId: string): Promise<boolean> {
    const config: AccessConfigModel = await this.affiliateBrandingAccessConfigsModel.findOne({
      internalDomain: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.affiliateBranding !== brandingId;
  }

  public async deleteAllByaccessConfigId(affiliateBrandingId: string): Promise<void> {
    await this.affiliateBrandingAccessConfigsModel.deleteMany({
      affiliateBranding: affiliateBrandingId,
    });
  }

  public async updateById(
    accessConfigId: string,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    if (dto.internalDomain) {
      dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain);
    }

    return this.affiliateBrandingAccessConfigsModel.findByIdAndUpdate(
      accessConfigId,
      { $set: dto },
      { new: true },
    );
  }

  private async create(
    affiliateBranding: AffiliateBrandingModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    const slugifiedBrandingName: string = DomainHelper.nameToDomain(affiliateBranding.name);

    return this.affiliateBrandingAccessConfigsModel.create({
      ...dto,
      affiliateBranding: affiliateBranding._id,
      internalDomain: DomainHelper.nameToDomain(dto.internalDomain) || slugifiedBrandingName,
      internalDomainPattern: dto.internalDomain ? undefined : slugifiedBrandingName,

      business: affiliateBranding.business as any,
    } as AccessConfigModel);
  }

  private async update(
    currentAccessConfig: AccessConfigModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {

    if (dto.internalDomain) {
      dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain);
    }

    return this.affiliateBrandingAccessConfigsModel.findByIdAndUpdate(
      currentAccessConfig._id,
      { $set: dto },
      { new: true },
    );
  }
}
