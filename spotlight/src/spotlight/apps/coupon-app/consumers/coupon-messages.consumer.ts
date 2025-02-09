import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { CouponRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { CouponEventDto } from '../dto';

@Controller()
export class CouponMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CouponRabbitEventsEnum.CouponCreated,
  })
  public async onCouponCreated(data: CouponEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CouponRabbitEventsEnum.CouponUpdated,
  })
  public async onCouponUpdated(data: CouponEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CouponRabbitEventsEnum.CouponExported,
  })
  public async onCouponExport(data: CouponEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: CouponRabbitEventsEnum.CouponRemoved,
  })
  public async onCouponDeleted(data: CouponEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.coupon._id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: CouponEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.couponToSpotlightDocument(data), 
      data.coupon._id,
    );
  } 

  private couponToSpotlightDocument(data: CouponEventDto): SpotlightInterface {
    return {
      app: AppEnum.Coupon,
      businessId: data.coupon.businessId,
      description: data.coupon.description,
      icon: '',
      payload: {
        code: data.coupon.code,
        status: data.coupon.status,
      },
      serviceEntityId: data.coupon._id,
      title: data.coupon.name,
    };
  }
}
