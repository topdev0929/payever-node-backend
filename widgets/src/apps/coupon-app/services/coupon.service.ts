import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CouponModel } from '../models';
import { Model } from 'mongoose';
import { CouponEventDto } from '../dto';
import { CouponSchemaName } from '../schemas';
import { CouponsStatusEnum } from '../enums';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(CouponSchemaName) private readonly couponModel: Model<CouponModel>,
  ) { }

  public async createOrUpdateCouponFromEvent(data: CouponEventDto): Promise<CouponModel> {
    const businessId: string = data.businessId;

    return this.couponModel.findOneAndUpdate(
      { _id: data._id },
      {
        $set: {
          businessId,
          code: data.code,
          description: data.description,
          endDate: data.endDate,
          isAutomaticDiscount: data.isAutomaticDiscount,
          name: data.name,
          startDate: data.startDate,
          status: data.status,
          type: data.type.type,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteCoupon(data: CouponEventDto): Promise<void> {
    await this.couponModel.deleteOne({ _id: data._id }).exec();
  }

  public async getActiveBusinessCoupon(businessId: string): Promise<CouponModel> {
    return this.couponModel.findOne({
      businessId,
      status: CouponsStatusEnum.ACTIVE,
    }).limit(1).sort({ createdAt: -1 });
  }
}
