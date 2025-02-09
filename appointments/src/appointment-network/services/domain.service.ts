import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as dns from 'dns';
import { v4 as uuid4 } from 'uuid';
import { DomainSchemaName } from '../schemas';
import { CreateDomainDto, UpdateDomainDto } from '../dto';
import { AppointmentNetworkModel, DomainModel } from '../models';
import { DomainCheckInterface } from '../interfaces';
import { environment } from '../../environments';

const HOUR_IN_MS: number = 60000; // 60 * 1000

@Injectable()
export class DomainService {
  private payeverIP: string;
  private payeverCNAME: string;
  
  constructor(
    @InjectModel(DomainSchemaName) private readonly domainModel: Model<DomainModel>,
    ) {
      this.payeverCNAME = environment.payeverCNAME;
      this.payeverIP = environment.payeverIP;
    }

  public async findAndPopulateByCondition(condition: FilterQuery<DomainModel>)
  : Promise<DomainModel[]> {
    return this.domainModel.find(condition);
  }

  public async findByNetwork(id: string): Promise<DomainModel[]> {
    return this.domainModel.find({
      appointmentNetwork: id,
    });
  }

  public async  findByDomain(domain: string): Promise<DomainModel> {
    return this.domainModel.findOne({
      name: domain,
    });
  }

  public async create(
    appointmentNetwork: AppointmentNetworkModel,
    dto: CreateDomainDto,
  ): Promise<DomainModel> {
    return this.domainModel.create({
      _id: uuid4(),
      isConnected: false,
      name: dto.name,

      appointmentNetwork: appointmentNetwork._id,
    } as DomainModel);
  }

  public async update(
    current: DomainModel,
    dto: UpdateDomainDto,
  ): Promise<DomainModel> {
    return this.domainModel.findOneAndUpdate(
      {
        _id: current._id,
      },
      {
        $set: dto,
      },
      {
        new: true,
      });
  }

  public async delete(domain: DomainModel): Promise<void> {
    await this.domainModel.findByIdAndDelete(domain._id);
  }

  public async deleteAllByNetworkId(id: string): Promise<void> {
    const allDomains: DomainModel[] = await this.domainModel.find({
      accessConfig: id,
    });
    for (const domain of allDomains) {
      await this.delete(domain);
    }
  }

  public async getDomainForLastHour(): Promise<DomainModel[]> {
    const hourAgo: Date = new Date(Date.now() - HOUR_IN_MS);

    return this.findAndPopulateByCondition({
      createdAt: {
        $gte: hourAgo,
      },
    });
  }

  public async checkStatus(
    domain: DomainModel,
  ): Promise<DomainCheckInterface> {
    let cnames: string[] = [];
    try {
      cnames = await dns.promises.resolveCname(domain.name);
    } catch (e) {
    }

    try {
      const lookupAddress: dns.LookupAddress = await dns.promises.lookup(domain.name);
      const status: boolean = lookupAddress.address === this.payeverIP;

      if (status !== domain.isConnected) {
        await this.domainModel.findByIdAndUpdate(domain._id, { isConnected: status });
      }

      return {
        cnames: cnames,
        currentCname: status ? this.payeverCNAME : '',
        currentIp: lookupAddress.address,
        isConnected: status,
        requiredCname: this.payeverCNAME,
        requiredIp: this.payeverIP,
      };
    } catch (e) {
      throw new HttpException('No DNS record found for this domain', 400);
    }
  }
  
}
