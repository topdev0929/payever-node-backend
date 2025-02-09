import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessSchemaName, BusinessDetailSchemaName } from '../../mongoose-schema';
import { BusinessModel, BusinessDetailModel } from '../models';
import { BusinessService } from '@pe/business-kit';

@Injectable()
export class CheckoutBusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) public readonly businessModel: Model<BusinessModel>,
    @InjectModel(BusinessDetailSchemaName) public readonly businessDetailModel: Model<BusinessDetailModel>,
    private readonly businessService: BusinessService,
  ) { }

  public async findOneById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId) as BusinessModel;
    await business.populate('businessDetail').execPopulate();

    return business;
  }

}
