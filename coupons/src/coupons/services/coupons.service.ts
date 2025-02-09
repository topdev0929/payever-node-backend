// tslint:disable object-literal-sort-keys
import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { ListQueryDto, PagingResultDto } from '@pe/folders-plugin';

import {
  CreateCouponDto,
  ApplyCouponDto,
  CouponQueryDto,
} from '../dto';
import {
  CouponEventNamesEnum,
  CouponsStatusEnum,
  CouponTypeCustomerEligibilityEnum,
  RabbitExchangesEnum,
} from '../enum';
import {
  ApplyCouponResponseInterface,
} from '../interfaces';
import {
  CouponSchemaName,

  CouponDocument,
  Coupon,
  CouponTypePercentage,
  CouponsTypeFixedAmount,
  CouponTypeBuyXGetY,
} from '../schemas';
import { EligibilityReturnType } from '../interfaces/eligibility-response.interface';
import { AbstractCollector, Collector, EventDispatcher, RabbitMqRPCClient } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { CouponUsedService } from './coupon-used.service';
import { CouponHandlerInterface } from '../listeners';

@Injectable()
@Collector('CouponTypeService')
export class CouponsService extends AbstractCollector {
  @Inject() private readonly rabbitMqRPCClient: RabbitMqRPCClient;
  @InjectModel(CouponSchemaName) private readonly couponModel: Model<CouponDocument>;
  constructor(
    private readonly couponUsedService: CouponUsedService,
    private readonly eventDispatcher: EventDispatcher,
  ) { super(); }

  public async create(data: Coupon): Promise<CouponDocument> {
    if (data.code) {
      const existingCouponWithSameCode: CouponDocument[] = await this.find({
        businessId: data.businessId,
        code: data.code,
      });
      if (existingCouponWithSameCode.length > 0) {
        throw new BadRequestException({
          message: `Code '${data.code}' is not unique`,
        });
      }
    }

    const serviceForCoupon: CouponHandlerInterface = this.getServiceFor(data);

    const coupon: CouponDocument = await serviceForCoupon.create(data);

    await this.eventDispatcher.dispatch(CouponEventNamesEnum.CREATED, coupon);

    return coupon;
  }

  public async find(
    filter: FilterQuery<CouponDocument> = { },
    projection: any = { },
  ): Promise<CouponDocument[]> {
    return this.couponModel.find(filter, projection);
  }

  public async getForAdmin(query: CouponQueryDto)
    : Promise<{ documents: CouponDocument[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    const documents: CouponDocument[] = await this.couponModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.couponModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async readCouponExtra(
    coupon: Coupon,
  ): Promise<any> {
    if (CouponsTypeFixedAmount.isCouponTypeOf(coupon) || CouponTypePercentage.isCouponTypeOf(coupon)) {
      return {
        appliesTo: coupon.type.appliesTo,
        appliesToProducts: coupon.type.appliesToProducts,
        appliesToCategories: coupon.type.appliesToCategories,
      };
    } else if (CouponTypeBuyXGetY.isCouponTypeOf(coupon)) {
      return {
        buyCategories: coupon.type.buyCategories,
        buyProducts: coupon.type.buyProducts,
        getCategories: coupon.type.getCategories,
        getProducts: coupon.type.getProducts,
      };
    } else {
      return null;
    }
  }

  public async readCouponEligibility(
    coupon: Coupon,
  ): Promise<EligibilityReturnType> {
    return {
      customerEligibility: coupon.customerEligibility,
      customerEligibilitySpecificCustomers: coupon.customerEligibilitySpecificCustomers,
      customerEligibilityCustomerGroups: coupon.customerEligibilityCustomerGroups,
    };
  }

  public async getCouponByChannelsetAndCustomer(
    channelSetId: string,
    customerEmail: string,
    groupId: string,
  ): Promise<CouponDocument> {
    const filter: FilterQuery<CouponDocument> = { channelSets: channelSetId, status: CouponsStatusEnum.ACTIVE };

    if (customerEmail) {
      filter.customerEligibilitySpecificCustomers = customerEmail;
    }
    if (groupId) {
      filter.customerEligibilityCustomerGroups = groupId;
    }

    return this.couponModel.findOne(filter);
  }

  public async update(currentCoupon: Coupon, updatedCouponDto: CreateCouponDto): Promise<CouponDocument> {
    if (updatedCouponDto.code && updatedCouponDto.code !== currentCoupon.code) {
      throw new BadRequestException({
        message: `Coupon code cannot be altered`,
      });
    }

    const coupon: CouponDocument = await this.couponModel.findOneAndUpdate(
      { _id: currentCoupon._id },
      { $set: updatedCouponDto },
      {
        new: true,
        upsert: true,
      },
    );

    await this.eventDispatcher.dispatch(CouponEventNamesEnum.UPDATED, coupon);

    return coupon;
  }

  public async delete(coupon: CouponDocument): Promise<void> {
    void await this.couponModel.remove({
      _id: coupon._id,
    });

    await this.eventDispatcher.dispatch(CouponEventNamesEnum.DELETED, coupon);
  }

  public async applyCoupon(dto: ApplyCouponDto, business: BusinessModel): Promise<ApplyCouponResponseInterface> {
    const coupon: CouponDocument = await this.couponModel.findOne({
      code: dto.couponCode,
      businessId: business._id,
    });

    if (!coupon) {
      throw new NotFoundException({
        msg: `Coupon by code "${dto.couponCode}" not found`,
        filter: {
          code: dto.couponCode,
          businessId: business._id,
        },
      });
    }

    if (coupon.status === CouponsStatusEnum.INACTIVE) {
      throw new BadRequestException({
        message: `Coupon not active`,
      });
    }

    await this.denyIfLimitsReached(dto, coupon);
    await this.denyIfCustomerNotEligible(dto, coupon);

    const serviceForCoupon: CouponHandlerInterface = this.getServiceFor(coupon);

    return serviceForCoupon.applyCoupon(coupon, dto, coupon._id);
  }

  private async denyIfLimitsReached(dto: ApplyCouponDto, coupon: CouponDocument): Promise<void> {
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (coupon.limits.limitOneUsePerCustomer) {
      if (await this.couponUsedService.getCouponUsageForCustomer(coupon._id, dto.customerEmail)) {
        throw new BadRequestException({
          message: `Coupon only allowed to be used once`,
        });
      }
    }

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (coupon.limits.limitUsage && coupon.limits.limitUsageAmount) {
      if (await this.couponUsedService.getTotalCouponUsage(coupon._id)) {
        throw new BadRequestException({
          message: `Maximum usage for coupon reached`,
        });
      }
    }
  }

  private async denyIfCustomerNotEligible(dto: ApplyCouponDto, coupon: CouponDocument): Promise<void> {
    if (coupon.customerEligibility === CouponTypeCustomerEligibilityEnum.EVERYONE) {
      return;
    }

    if (
      coupon.customerEligibility === CouponTypeCustomerEligibilityEnum.SPECIFIC_CUSTOMERS &&
      !coupon.customerEligibilitySpecificCustomers.includes(dto.customerEmail)
    ) {
      throw new BadRequestException({
        message: `Coupon only allowed for specific customer`,
      });
    }

    if (coupon.customerEligibility === CouponTypeCustomerEligibilityEnum.SPECIFIC_GROUPS_OF_CUSTOMERS) {
      const findContactsDocumentRpcMethod: string = 'contacts.rpc.folder-plugin.readonly.es.search';
      const query: ListQueryDto = new ListQueryDto();
      query.filters = {
        email: {
          condition: 'isIn',
          value: [dto.customerEmail],
        },
        parentFolderId: {
          condition: 'isIn',
          value: coupon.customerEligibilityCustomerGroups,
        },
      };

      const [contacsWithEmail]: PagingResultDto[] = await this.rabbitMqRPCClient.send({
        channel: findContactsDocumentRpcMethod,
        exchange: RabbitExchangesEnum.rpcCalls,
      }, {
        name: findContactsDocumentRpcMethod,
        payload: {
          query,
          businessId: coupon.businessId,
        },
      }, {
        responseType: 'json',
        replyExceptions: true,
      });

      if (!contacsWithEmail.collection.length) {
        throw new BadRequestException({
          message: `Coupon only allowed for specific group of customers`,
        });
      }
    }
  }

  private getServiceFor(coupon: Coupon): CouponHandlerInterface {
    return (this.services as CouponHandlerInterface[]).find(
      (service: CouponHandlerInterface) => service.isHandlerFor(coupon),
    );
  }
}
