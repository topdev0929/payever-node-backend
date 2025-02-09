import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model, FilterQuery } from 'mongoose';
import { CouponSchemaName, CouponDocument } from '../schemas';
import { CouponEventsProducer } from '../producer/coupon-events.producer';

@Injectable()
export class CouponExportCommand {
  constructor(
    @InjectModel(CouponSchemaName) private readonly couponsModel: Model<CouponDocument>,
    private readonly couponRabbitEventsProducer: CouponEventsProducer,
  ) { }

  /**
   * @deprecated
   */
  @Command({
    command: 'coupon:export [--uuid] [--after]',
    describe: 'Export coupons through the bus',
  })
  public async couponExport(
    @Option({
      name: 'uuid',
    }) couponId?: string,
    @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    const criteria: FilterQuery<CouponDocument> = { };
    if (couponId) {
      criteria._id = couponId;
    }
    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }

    const count: number = await this.couponsModel.countDocuments(criteria);
    const limit: number = 100;
    let start: number = 0;
    let coupons: CouponDocument[] = [];

    while (start < count) {
      coupons = await this.getWithLimit(criteria, start, limit);
      start += limit;

      for (const coupon of coupons) {
        await this.couponRabbitEventsProducer.produceCouponExported(coupon);
      }
    }
  }

  private async getWithLimit(
    query: FilterQuery<CouponDocument>,
    start: number,
    limit: number,
  ): Promise<CouponDocument[]> {
    return this.couponsModel.find(query, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }
}
