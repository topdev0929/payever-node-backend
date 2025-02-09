import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { JwtAuthGuard, ParamModel, QueryDto, Roles, RolesEnum } from '@pe/nest-kit';
import { CouponsService } from '../services/coupons.service';
import { CreateCouponDto } from '../dto/coupon-create.dto';
import { CouponSchemaName, CouponDocument } from '../schemas';
import { EligibilityReturnType } from '../interfaces';
import { AppliesToResponseDto } from '../dto/applies-to-response.dto';
import { AdminCreateCouponDto, CouponQueryDto } from '../dto';

const COUPON_ID: string = ':couponId';

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

@Controller('admin/coupons')
@ApiTags('admin coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminCouponsController {
  constructor(
    private readonly couponsService: CouponsService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(    
    @QueryDto() query: CouponQueryDto,
  ): Promise<any> {
    return this.couponsService.getForAdmin(query);
  }

  @Get(COUPON_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @ParamModel(COUPON_ID, CouponSchemaName) coupon: CouponDocument,
  ): Promise<CouponDocument> {
    return coupon;
  }
  
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  public async getByCode(
    @ParamModel({ code: ':code' }, CouponSchemaName) coupon: CouponDocument,
  ): Promise<CouponDocument> {
    return coupon;
  }

  @Get('channelset/:channelsetId')
  @HttpCode(HttpStatus.OK)
  public async getByChannelsetAndCustomer(
    @Param('channelsetId', new ParseUUIDPipe()) channelSetId: string,
    @Query('customerEmail') customerEmail: string,
    @Query('groupId') groupId: string,
  ): Promise<CouponDocument> {
    return this.couponsService.getCouponByChannelsetAndCustomer(channelSetId, customerEmail, groupId);
  }

  @Get(`${COUPON_ID}/type-extra-fields`)
  @HttpCode(HttpStatus.OK)
  public async readAppliesToProductsOfCoupon(
    @ParamModel(COUPON_ID, CouponSchemaName) coupon: CouponDocument,
  ): Promise<AppliesToResponseDto> {
    return this.couponsService.readCouponExtra(coupon);
  }


  @Get(`${COUPON_ID}/eligibility`)
  @HttpCode(HttpStatus.OK)
  public async getCouponEligibility(
    @ParamModel(COUPON_ID, CouponSchemaName) coupon: CouponDocument,
  ): Promise<EligibilityReturnType> {
    return this.couponsService.readCouponEligibility(coupon);
  }

  
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(    
    @Body() body: AdminCreateCouponDto,
  ): Promise<CouponDocument> {
    return this.couponsService.create(body as any);
  }


  @Put(COUPON_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(COUPON_ID, CouponSchemaName) coupon: CouponDocument,
    @Body() body: CreateCouponDto,
  ): Promise<CouponDocument> {
    return this.couponsService.update(coupon, body);
  }


  @Delete(COUPON_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @ParamModel(COUPON_ID, CouponSchemaName) coupon: CouponDocument,
  ): Promise<void> {
    await this.couponsService.delete(coupon);
  }
}
