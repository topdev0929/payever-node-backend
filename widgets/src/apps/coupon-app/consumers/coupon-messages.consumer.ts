import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CouponService } from '../services';
import { CouponRabbitMessagesEnum } from '../enums';
import { CouponEventDto } from '../dto';

@Controller()
export class CouponMessagesConsumer {
  constructor(
    private readonly couponService: CouponService,
  ) { }

  @MessagePattern({
    name: CouponRabbitMessagesEnum.couponCreated,
  })
  public async onCouponCreated(data: any): Promise<void> {
    await this.couponService.createOrUpdateCouponFromEvent(data.coupon);
  }

  @MessagePattern({
    name: CouponRabbitMessagesEnum.couponUpdated,
  })
  public async onCouponUpdated(data: any): Promise<void> {
    await this.couponService.createOrUpdateCouponFromEvent(data.coupon);
  }

  @MessagePattern({
    name: CouponRabbitMessagesEnum.couponExported,
  })
  public async onCouponExport(data: any): Promise<void> {
    await this.couponService.createOrUpdateCouponFromEvent(data.coupon);
  }

  @MessagePattern({
    name: CouponRabbitMessagesEnum.couponRemoved,
  })
  public async onTerminalDeleted(data: any): Promise<void> {
    await this.couponService.deleteCoupon(data.coupon);
  }
}
