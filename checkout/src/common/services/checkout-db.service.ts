import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckoutSchemaName } from '../../mongoose-schema';
import { CheckoutModel } from '../../checkout/models';
import { BusinessModel } from '../../business/models';

@Injectable()
export class CheckoutDbService {
  constructor(
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
  ) { }

  public async findOneById(checkoutId: string): Promise<CheckoutModel> {
    return this.checkoutModel.findById(checkoutId);
  }

  public async findDefaultForBusiness(business: BusinessModel): Promise<CheckoutModel> {
    return this.checkoutModel.findOne({ businessId: business.id, default: true });
  }

  public async findAllByBusiness(business: BusinessModel): Promise<CheckoutModel[]> {
    return this.checkoutModel.find({ businessId: business.id });
  }
}
