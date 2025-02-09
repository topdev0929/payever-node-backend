import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CouponUsedSchemaName, CouponUsedDocument } from '../schemas';

@Injectable()
export class CouponUsedService {
  constructor(
    @InjectModel(CouponUsedSchemaName) private readonly couponUsedModel: Model<CouponUsedDocument>,
  ) { }

  public async addUsage(couponId: string, customerEmail: string): Promise<CouponUsedDocument> {
    return this.couponUsedModel.create( { coupon: couponId, email: customerEmail } );
  }

  public async getTotalCouponUsage(couponId: string): Promise<number> {
     return this.couponUsedModel.countDocuments( { coupon: couponId } );
  }

  public async getCouponUsageForCustomer(couponId: string, customerEmail: string): Promise<number> {
    return this.couponUsedModel.countDocuments( { coupon: couponId, email: customerEmail } );
  }
}
