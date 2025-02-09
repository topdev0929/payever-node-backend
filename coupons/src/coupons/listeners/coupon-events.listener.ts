import { Injectable } from '@nestjs/common';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum, BusinessModel } from '@pe/business-kit';
import { CouponsService } from '../services';
import { Coupon, CouponDocument, CouponTypePercentage } from '../schemas';
import { CouponEventsProducer } from '../producer/coupon-events.producer';
import {
  CouponEventNamesEnum,
  CouponsStatusEnum,
  CouponTypeAppliedToEnum,
  CouponTypeCustomerEligibilityEnum,
  CouponTypeEnum,
  CouponTypeMinimumRequirementsEnum,
} from '../enum';

@Injectable()
export class CouponEventsListener {

  constructor(
    private readonly couponService: CouponsService,
    private readonly producer: CouponEventsProducer,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(CouponEventNamesEnum.CREATED)
  public async onCouponCreated(coupon: CouponDocument): Promise<void>  {
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, coupon);
    await this.producer.produceCouponCreated(coupon);
  }

  @EventListener(CouponEventNamesEnum.UPDATED)
  public async onCouponUpdated(coupon: CouponDocument): Promise<void>  {
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, coupon);
  }

  @EventListener(CouponEventNamesEnum.DELETED)
  public async onCouponDeleted(coupon: CouponDocument): Promise<void>  {
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, coupon._id);
    await this.producer.produceCouponDeleted(coupon);
  }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onMessageDataUpdated(
    business: BusinessModel,
  ): Promise<void> {
    const defaultCouponPrototype: Coupon<CouponTypePercentage> = {
      businessId: business._id,
      channelSets: [],
      code: null,
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      customerEligibilityCustomerGroups: [],
      customerEligibilitySpecificCustomers: [],
      description: '10% off on all',
      endDate:  new Date(),
      isAutomaticDiscount: false,
      limits:  {
        limitOneUsePerCustomer: false,
        limitUsage: false,
        limitUsageAmount: null,
      },
      name: 'name',
      startDate: new Date(),
      status: CouponsStatusEnum.ACTIVE,
      type: {
        appliesTo: CouponTypeAppliedToEnum.ALL_PRODUCTS,
        appliesToCategories: [],
        appliesToProducts: [],
        discountValue: 10,
        minimumRequirements: CouponTypeMinimumRequirementsEnum.NONE,
        type: CouponTypeEnum.PERCENTAGE,
      },
    };
    await this.couponService.create(defaultCouponPrototype);
  }
}
