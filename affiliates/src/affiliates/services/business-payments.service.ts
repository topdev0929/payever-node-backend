import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessPaymentsDto } from '../dto';
import { BusinessPaymentsModel } from '../models';
import { Model } from 'mongoose';
import { BusinessPaymentsSchemaName } from '../schemas';
import { BusinessModel } from '@pe/business-kit';

@Injectable()
export class BusinessPaymentsService {
  constructor(
    @InjectModel(BusinessPaymentsSchemaName) private readonly businessPaymentsModel: Model<BusinessPaymentsModel>,
  ) { }

  public async getByBusiness(business: BusinessModel)
  : Promise<BusinessPaymentsModel> {
    return this.businessPaymentsModel.findOne({ business: business._id });
  }

  public async create(business: BusinessModel, createBusinessPaymentsDto: BusinessPaymentsDto)
  : Promise<BusinessPaymentsModel> {
    return this.businessPaymentsModel.create({
      ...createBusinessPaymentsDto,
      business: business._id,
    });
  }

  public async update(business: BusinessModel, createBusinessPaymentsDto: BusinessPaymentsDto)
  : Promise<BusinessPaymentsModel> {
    await this.businessPaymentsModel.updateOne(
      { business: business._id },
      {
        $set: {
          ...createBusinessPaymentsDto,
        },
      },      
    );
    
    return this.businessPaymentsModel.findOne( 
      { business: business._id },
    );
  }
}
