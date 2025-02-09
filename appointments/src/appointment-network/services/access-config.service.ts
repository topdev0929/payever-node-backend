import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as dns from 'dns';
import { UpdateAccessConfigDto } from '../dto';
import { DomainCheckInterface } from '../interfaces';
import { AccessConfigSchemaName } from '../schemas';
import { AccessConfigModel, AppointmentNetworkModel } from '../models';
import { environment } from '../../environments';
import { DomainHelper } from '../helpers';

@Injectable()
export class AccessConfigService {
  private payeverIP: string;
  private payeverCNAME: string;

  constructor(
    @InjectModel(AccessConfigSchemaName) 
    private readonly appointmentNetworkAccessConfigsModel: Model<AccessConfigModel>,
  ) {
    this.payeverCNAME = environment.payeverCNAME;
    this.payeverIP = environment.payeverIP;
  }

  public async getByDomain(domain: string): Promise<AccessConfigModel> {
    const appointmentDomain: string = environment.appointmentsDomain;

    const condition: FilterQuery<AccessConfigModel> = appointmentDomain && domain.endsWith(appointmentDomain)
      ? { internalDomain: domain.replace('.' + appointmentDomain, '') }
      : { ownDomain: domain };

    return this.appointmentNetworkAccessConfigsModel.findOne(condition);
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

  public async findOrCreate(businessId: string, appointmentNetwork: AppointmentNetworkModel): 
  Promise<AccessConfigModel> { 
    const oldAccessConfig: AccessConfigModel = await this.appointmentNetworkAccessConfigsModel.findOne({
      appointmentNetwork: appointmentNetwork._id,
      business: businessId,
    });   

    if (!oldAccessConfig) {
      return this.create(appointmentNetwork, { });
    }

    return oldAccessConfig;
  }

  public async createOrUpdate(
    appointmentNetwork: AppointmentNetworkModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    const oldAccessConfig: AccessConfigModel = await this.appointmentNetworkAccessConfigsModel.findOne({
      appointmentNetwork: appointmentNetwork._id,
      business: appointmentNetwork.business as any,
    });

    return !oldAccessConfig
      ? this.create(appointmentNetwork, dto)
      : this.update(oldAccessConfig, dto);
  }

  public async setLive(appointmentNetworkId: string): Promise<void> {
    await this.appointmentNetworkAccessConfigsModel.findOneAndUpdate(
      {
        appointmentNetwork: appointmentNetworkId,
      },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async getIsLive(businessId: string, appointmentNetworkId: string): Promise<boolean> {
    const currentAccessConfig: AccessConfigModel 
    = await this.appointmentNetworkAccessConfigsModel.findOne(
      { 
        appointmentNetwork: appointmentNetworkId,
        business: businessId,
      },
    );

    return currentAccessConfig.isLive;
  }

  public async findOneByCondition(
    condition: FilterQuery<AccessConfigModel>,
  ): Promise<AccessConfigModel> {
    return this.appointmentNetworkAccessConfigsModel.findOne(condition);
  }

  public async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: AccessConfigModel = await this.appointmentNetworkAccessConfigsModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config;
  }

  public async isDomainOccupied(domain: string, appointmentNetworkId: string): Promise<boolean> {
    const config: AccessConfigModel = await this.appointmentNetworkAccessConfigsModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.appointmentNetwork !== appointmentNetworkId;
  }

  public async isInternalDomainOccupied(domain: string, appointmentNetworkId: string): Promise<boolean> {
    const config: AccessConfigModel = await this.appointmentNetworkAccessConfigsModel.findOne({
      internalDomain: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.appointmentNetwork !== appointmentNetworkId;
  }

  public async deleteAllByaccessConfigId(appointmentNetworkId: string): Promise<void> {
    await this.appointmentNetworkAccessConfigsModel.deleteMany({
      appointmentNetwork: appointmentNetworkId,
    });
  }

  public async updateById(
    accessConfigId: string,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    if (dto.internalDomain) {
      dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain);
    }

    return this.appointmentNetworkAccessConfigsModel.findByIdAndUpdate(
      accessConfigId,
      { $set: dto },
      { new: true },
    );
  }

  private async create(
    appointmentNetwork: AppointmentNetworkModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    const slugifiedNetworkName: string = DomainHelper.nameToDomain(appointmentNetwork.name);
    
    return this.appointmentNetworkAccessConfigsModel.create({
      ...dto,
      appointmentNetwork: appointmentNetwork._id,
      internalDomain: DomainHelper.nameToDomain(dto.internalDomain) || slugifiedNetworkName,
      internalDomainPattern: dto.internalDomain ? undefined : slugifiedNetworkName,

      business: appointmentNetwork.business as any,
    } as AccessConfigModel);
  }

  private async update(
    currentAccessConfig: AccessConfigModel,
    dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    if (dto.internalDomain) {
      const domain: string = DomainHelper.nameToDomain(dto.internalDomain);
      if (await this.isDomainOccupied(domain, currentAccessConfig.appointmentNetwork as string)) {
        const suffix: string
          = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
        dto.internalDomain = dto.internalDomain + '-' + suffix;
      }
    }

    if (dto.internalDomain) {
      dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain);
    }

    return this.appointmentNetworkAccessConfigsModel.findByIdAndUpdate(
      currentAccessConfig._id,
      { $set: dto },
      { new: true },
    );
  }
}
