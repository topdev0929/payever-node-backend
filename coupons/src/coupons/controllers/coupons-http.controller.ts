import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';

import { CouponsService } from '../services/coupons.service';
import { INVALID_CREDENTIALS_MESSAGE } from '../const/errors';
import { CreateCouponDto } from '../dto/coupon-create.dto';
import { CouponSchemaName, CouponDocument } from '../schemas';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { ApplyCouponResponseInterface, EligibilityReturnType } from '../interfaces';
import { AppliesToResponseDto } from '../dto/applies-to-response.dto';
import { ApplyCouponDto } from '../dto';

const BUSINESS_ID: string = ':businessId';

const defaultNonFetchableFields: { [key: string]: number } = {
  customerEligibilityCustomerGroups: 0,
  customerEligibilitySpecificCustomers: 0,
  'type.appliesToCategories': 0,
  'type.appliesToProducts': 0,

  'type.buyCategories': 0,
  'type.buyProducts': 0,
  'type.getCategories': 0,
  'type.getProducts': 0,
};

@Controller('business/:businessId/coupons')
@ApiTags('coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon created' })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.create })
  public async create(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: CreateCouponDto,
  ): Promise<CouponDocument> {
    return this.couponsService.create({
      ...dto,
      businessId: business._id,
    });
  }

  @Post('/apply-coupon')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon applied' })
  @Roles(RolesEnum.anonymous)
  public async applyCoupon(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: ApplyCouponDto,
  ): Promise<ApplyCouponResponseInterface> {
    return this.couponsService.applyCoupon(dto, business);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupons readed' })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.read })
  public async readAll(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<CouponDocument[]> {
    return this.couponsService.find({
      businessId: business._id,
    }, defaultNonFetchableFields);
  }

  @Get('/:couponId/type-extra-fields')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupons readed', type: AppliesToResponseDto })
  @ApiParam({
    name: 'couponId',
  })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.read })
  public async readAppliesToProductsOfCoupon(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: ':couponId',
      businessId: BUSINESS_ID,
    }, CouponSchemaName) coupon: CouponDocument,
  ): Promise<AppliesToResponseDto> {
    return this.couponsService.readCouponExtra(coupon);
  }

  @Get('/:couponId/eligibility')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupons readed' })
  @ApiParam({
    name: 'couponId',
  })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.read })
  public async readCustomersOfCoupon(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: ':couponId',
      businessId: BUSINESS_ID,
    }, CouponSchemaName) coupon: CouponDocument,
  ): Promise<EligibilityReturnType> {
    return this.couponsService.readCouponEligibility(coupon);
  }

  @Get('/:couponId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon readed' })
  @ApiParam({
    name: 'couponId',
  })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.read })
  public async readOne(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: ':couponId',
      businessId: BUSINESS_ID,
    }, CouponSchemaName) coupon: CouponDocument,
  ): Promise<CouponDocument> {

    return coupon;
  }

  @Get('/by-code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon readed' })
  @ApiParam({
    name: 'code',
  })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.read })
  public async readByCode(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      code: ':code',
    }, CouponSchemaName) coupon: CouponDocument,
  ): Promise<CouponDocument> {

    return coupon;
  }

  @Get('/by-channelset/:channelsetId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon readed' })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.read })
  public async readByChannelset(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Param('channelsetId', new ParseUUIDPipe()) channelSetId: string,
    @Query('customerEmail') customerEmail: string,
    @Query('groupId') groupId: string,
  ): Promise<CouponDocument> {

    return this.couponsService.getCouponByChannelsetAndCustomer(channelSetId, customerEmail, groupId);
  }

  @Put('/:couponId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon updated' })
  @ApiParam({
    name: 'couponId',
  })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.update })
  public async patch(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: ':couponId',
      businessId: BUSINESS_ID,
    }, CouponSchemaName) coupon: CouponDocument,
    @Body() dto: CreateCouponDto,
  ): Promise<CouponDocument> {
    return this.couponsService.update(coupon, dto);
  }

  @Delete('/:couponId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coupon deleted' })
  @ApiParam({
    name: 'couponId',
  })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'coupons', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: ':couponId',
      businessId: BUSINESS_ID,
    }, CouponSchemaName) coupon: CouponDocument,
  ): Promise<void> {
    await this.couponsService.delete(coupon);
  }
}
