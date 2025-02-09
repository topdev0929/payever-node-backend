import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BusinessService } from '@pe/business-kit';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { CheckoutSchemaName } from '../../mongoose-schema';
import { UpdateCheckoutDto, AdminCheckoutListDto, AdminCreateCheckoutDto } from '../dto';
import { CheckoutModel, SectionModel } from '../models';
import { CheckoutService, SectionsService } from '../services';
import { RabbitEventsProducer } from '../../common/producer';
import { ValidationService } from '../../common/services';
import { plainToClass } from 'class-transformer';
const CHECKOUT_ID_PLACEHOLDER: string = ':checkoutId';

@Controller('admin/checkouts')
@ApiTags('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminCheckoutController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly checkoutService: CheckoutService,
    private readonly validationService: ValidationService,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly sectionsService: SectionsService,
  ) { }

  @Get()
  public async findAll(
    @Query() dto: AdminCheckoutListDto,
  ): Promise<CheckoutModel[]> {
    return this.checkoutService.retrieveListForAdmin(dto);
  }

  @Get(CHECKOUT_ID_PLACEHOLDER)
  public async getCheckout(
    @ParamModel(CHECKOUT_ID_PLACEHOLDER, CheckoutSchemaName) checkout: CheckoutModel,
    @Param('checkoutId') swagger__checkoutId: string,
  ): Promise<CheckoutModel> {
    return checkout;
  }

  @Get(':checkoutId/sections/available')
  public async getCheckoutAvailableSections(
    @ParamModel(CHECKOUT_ID_PLACEHOLDER, CheckoutSchemaName, true) checkout: CheckoutModel,
  ): Promise<SectionModel[]> {
    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;

    return this.sectionsService.getAvailableSections(checkout, business);
  }

  @Post()
  public async createCheckout(
    @Body() body: any,
  ): Promise<CheckoutModel> {
    const createCheckoutDto: AdminCreateCheckoutDto = plainToClass(AdminCreateCheckoutDto, body);
    const business: BusinessModel =
      await this.businessService.findOneById(createCheckoutDto.businessId) as BusinessModel;

    const isCheckoutNameValid: boolean = await this.validationService.validateCheckoutName(
      business,
      createCheckoutDto.name,
    );
    if (!isCheckoutNameValid) {
      throw new HttpException(`Checkout name '${createCheckoutDto.name}' not available`, HttpStatus.CONFLICT);
    }

    const checkout: CheckoutModel = await this.checkoutService.createBasedOnDefault(business, createCheckoutDto);
    if (createCheckoutDto.default) {
      await this.checkoutService.setDefault(checkout, business);
    }

    await this.rabbitEventsProducer.businessCheckoutCreated(checkout);

    return checkout;
  }

  @Patch(CHECKOUT_ID_PLACEHOLDER)
  public async updateCheckout(
    @ParamModel(CHECKOUT_ID_PLACEHOLDER, CheckoutSchemaName, true) checkout: CheckoutModel,
    @Param('checkoutId') swagger__checkoutId: string,
    @Body() body: any,
  ): Promise<CheckoutModel> {
    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;
    const updateDto = plainToClass(UpdateCheckoutDto, body);

    if (updateDto.settings && updateDto.settings.phoneNumber) {
      await this.validationService.validateSettingsPhone(updateDto.settings.phoneNumber, checkout.id);
    }
    if (updateDto.default) {
      await this.checkoutService.setDefault(checkout, business);
    }
    const updated: CheckoutModel = await this.checkoutService.update(checkout, updateDto);

    await this.rabbitEventsProducer.businessCheckoutUpdated(updated);

    return updated;
  }

  @Patch(':checkoutId/default')
  public async setCheckoutDefault(
    @ParamModel(CHECKOUT_ID_PLACEHOLDER, CheckoutSchemaName, true) checkout: CheckoutModel,
    @Param('checkoutId') swagger__checkoutId: string,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;

    await this.checkoutService.setDefault(checkout, business);
    await this.rabbitEventsProducer.businessCheckoutUpdated(checkout);
  }

  @Delete(CHECKOUT_ID_PLACEHOLDER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'The record has been successfully deleted' })
  public async deleteCheckout(
    @ParamModel(CHECKOUT_ID_PLACEHOLDER, CheckoutSchemaName, true) checkout: CheckoutModel,
    @Param('checkoutId') swagger__checkoutId: string,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;

    await this.checkoutService.remove(checkout, business);
    await this.rabbitEventsProducer.businessCheckoutRemoved(business, checkout);
  }
}
