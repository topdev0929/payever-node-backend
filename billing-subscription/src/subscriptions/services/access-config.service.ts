import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as dns from 'dns';
import { UpdateAccessConfigDto } from '../dto';
import { DomainCheckInterface } from '../interfaces';
import { AccessConfigSchemaName } from '../schemas';
import { AccessConfigModel, SubscriptionNetworkModel } from '../models';
import { environment } from '../../environments';
import { DomainHelper } from '../helpers';

@Injectable()
export class AccessConfigService {
  private payeverIP: string;
  private payeverCNAME: string;

  constructor(
    @InjectModel(AccessConfigSchemaName) 
    private readonly subscriptionNetworkAccessConfigsModel: Model<AccessConfigModel>,
  ) {
    this.payeverCNAME = environment.payeverCNAME;
    this.payeverIP = environment.payeverIP;
  }

  public async getByDomain(domain: string): Promise<AccessConfigModel> {
    const subscriptionDomain: string = environment.subscriptionsDomain;

    const condition: FilterQuery<AccessConfigModel> = subscriptionDomain && domain.endsWith(subscriptionDomain)
      ? { internalDomain: domain.replace('.' + subscriptionDomain, '') }
      : { ownDomain: domain };

    return this.subscriptionNetworkAccessConfigsModel.findOne(condition);
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

  public async findOrCreate(businessId: string, subscriptionNetwork: SubscriptionNetworkModel): 
  Promise<AccessConfigModel> { 
    const oldAccessConfig: AccessConfigModel = await this.subscriptionNetworkAccessConfigsModel.findOne({
      business: businessId,
      subscriptionNetwork: subscriptionNetwork._id,
    });   

    if (!oldAccessConfig) {
      return this.create(subscriptionNetwork, { });
    }

    return oldAccessConfig;
  }

  public async createOrUpdate(
    subscriptionNetwork: SubscriptionNetworkModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    const oldAccessConfig: AccessConfigModel = await this.subscriptionNetworkAccessConfigsModel.findOne({
      business: subscriptionNetwork.business as any,
      subscriptionNetwork: subscriptionNetwork._id,
    });

    return !oldAccessConfig
      ? this.create(subscriptionNetwork, dto)
      : this.update(oldAccessConfig, dto);
  }

  public async setLive(subscriptionNetworkId: string): Promise<void> {
    await this.subscriptionNetworkAccessConfigsModel.findOneAndUpdate(
      {
        subscriptionNetwork: subscriptionNetworkId,
      },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async getIsLive(businessId: string, subscriptionNetworkId: string): Promise<boolean> {
    const currentAccessConfig: AccessConfigModel 
    = await this.subscriptionNetworkAccessConfigsModel.findOne(
      { 
        business: businessId,
        subscriptionNetwork: subscriptionNetworkId,
      },
    );

    return currentAccessConfig.isLive;
  }

  public async findOneByCondition(
    condition: FilterQuery<AccessConfigModel>,
  ): Promise<AccessConfigModel> {
    return this.subscriptionNetworkAccessConfigsModel.findOne(condition);
  }

  public async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: AccessConfigModel = await this.subscriptionNetworkAccessConfigsModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config;
  }

  public async isDomainOccupied(domain: string, subscriptionNetworkId: string): Promise<boolean> {
    const config: AccessConfigModel = await this.subscriptionNetworkAccessConfigsModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.subscriptionNetwork !== subscriptionNetworkId;
  }

  public async isInternalDomainOccupied(domain: string, subscriptionNetworkId: string): Promise<boolean> {
    const config: AccessConfigModel = await this.subscriptionNetworkAccessConfigsModel.findOne({
      internalDomain: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.subscriptionNetwork !== subscriptionNetworkId;
  }

  public async deleteAllByaccessConfigId(subscriptionNetworkId: string): Promise<void> {
    await this.subscriptionNetworkAccessConfigsModel.deleteMany({
      subscriptionNetwork: subscriptionNetworkId,
    });
  }

  public async updateById(
    accessConfigId: string,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    if (dto.internalDomain) {
      dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain);
    }

    return this.subscriptionNetworkAccessConfigsModel.findByIdAndUpdate(
      accessConfigId,
      { $set: dto },
      { new: true },
    );
  }

  private async create(
    subscriptionNetwork: SubscriptionNetworkModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    const slugifiedNetworkName: string = DomainHelper.nameToDomain(subscriptionNetwork.name);
    
    return this.subscriptionNetworkAccessConfigsModel.create({
      ...dto,
      internalDomain: DomainHelper.nameToDomain(dto.internalDomain) || slugifiedNetworkName,
      internalDomainPattern: dto.internalDomain ? undefined : slugifiedNetworkName,
      subscriptionNetwork: subscriptionNetwork._id,

      business: subscriptionNetwork.business as any,
    } as AccessConfigModel);
  }

  private async update(
    currentAccessConfig: AccessConfigModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    if (dto.internalDomain) {
      const domain: string = DomainHelper.nameToDomain(dto.internalDomain);
      if (await this.isDomainOccupied(domain, currentAccessConfig.subscriptionNetwork as string)) {
        const suffix: string
          = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
        dto.internalDomain = dto.internalDomain + '-' + suffix;
      }
    }

    if (dto.internalDomain) {
      dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain);
    }

    return this.subscriptionNetworkAccessConfigsModel.findByIdAndUpdate(
      currentAccessConfig._id,
      { $set: dto },
      { new: true },
    );
  }
}
