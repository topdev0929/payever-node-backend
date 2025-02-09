import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrustedDomainInterface } from '../interfaces';
import { TrustedDomainModel } from '../models';
import { TrustedDomainSchemaName } from '../schemas';

@Injectable()
export class TrustedDomainService {

  constructor(
    @InjectModel(TrustedDomainSchemaName) private readonly domainModel: Model<TrustedDomainModel>,
  ) { }

  public async getByBusiness(businessId: string): Promise<TrustedDomainModel[]> {
    return this.domainModel.find({ businessId: businessId }).exec();
  }

  public async add(data: TrustedDomainInterface): Promise<void> {
    await this.domainModel.create(data);
  }

  public async delete(businessId: string, domain: string): Promise<void> {
    await this.domainModel.findOneAndDelete({ businessId: businessId, domain: domain }).exec();
  }

  public async isDomainTrusted(domain: string, businessId: string): Promise<boolean> {
    return this.domainModel.exists({
      businessId: businessId,
      domain: domain,
    });
  }
}
