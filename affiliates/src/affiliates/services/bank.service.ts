import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AffiliateBankDto } from '../dto';
import { AffiliateBankModel } from '../models';
import { Model } from 'mongoose';
import { AffiliateBankSchemaName } from '../schemas';
import { BusinessModel } from '@pe/business-kit';

@Injectable()
export class AffiliateBanksService {
  constructor(
    @InjectModel(AffiliateBankSchemaName) private readonly affiliateBankModel: Model<AffiliateBankModel>,
  ) { }

  public async getByBusiness(business: BusinessModel)
  : Promise<AffiliateBankModel[]> {
    return this.affiliateBankModel.find({ business: business._id });
  }

  public async create(business: BusinessModel, createAffiliateBankDto: AffiliateBankDto)
  : Promise<AffiliateBankModel> {
    return this.affiliateBankModel.create({
      ...createAffiliateBankDto,
      business: business._id,
    });
  }

  public async update(bank: AffiliateBankModel, createAffiliateBankDto: AffiliateBankDto)
  : Promise<AffiliateBankModel> {
    await this.affiliateBankModel.updateOne(         
      { _id: bank._id },
      {
        $set: {
          ...createAffiliateBankDto,
        },
      },      
    );
    
    return this.affiliateBankModel.findOne(         
      { _id: bank._id },
    );
  }

  public async delete(affiliateBank: AffiliateBankModel): Promise<void> {
    await affiliateBank.remove();
  }
}
