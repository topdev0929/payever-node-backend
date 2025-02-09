import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { BusinessSchemaName, CheckoutSchemaName } from '../../mongoose-schema';
import { CreateCheckoutDto, UpdateCheckoutDto, UpdateSettingsDto } from '../dto';
import { CheckoutModel, SectionModel } from '../models';
import { CheckoutService, SectionsService } from '../services';
import { UpdateSectionsDto } from '../dto/update-sections.dto';
import { RabbitEventsProducer } from '../../common/producer';
import { ValidationService } from '../../common/services';
import { plainToClass } from 'class-transformer';
const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const CHECKOUT_ID_PLACEHOLDER: string = ':checkoutId';

@Controller('business/:businessId/checkout')
@ApiTags('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly validationService: ValidationService,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly sectionsService: SectionsService,
  ) { }

  @Get()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async findAll(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<CheckoutModel[]> {
    return this.checkoutService.findAllByBusiness(business);
  }

  @Get(CHECKOUT_ID_PLACEHOLDER)
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getCheckout(
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<CheckoutModel> {
    return checkout;
  }

  @Get(':checkoutId/sections/available')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getCheckoutAvailableSections(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<SectionModel[]> {
    return this.sectionsService.getAvailableSections(checkout, business);
  }

  @Post()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.create })
  public async createCheckout(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() body: any,
  ): Promise<CheckoutModel> {
    const createCheckoutDto: CreateCheckoutDto = plainToClass(CreateCheckoutDto, body);

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
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async updateCheckout(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
    @Body() body: any,
  ): Promise<CheckoutModel> {
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

  @Patch('default/sections')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async updateDefaultCheckoutSections(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() updateSectionsDto: UpdateSectionsDto,
  ): Promise<void> {
    await ValidationService.validateDto(updateSectionsDto);

    const checkout: CheckoutModel = await this.checkoutService.findDefaultForBusiness(business);
    if (!checkout) {
      throw new HttpException('Could not find default checkout', HttpStatus.BAD_REQUEST);
    }

    await this.checkoutService.updateSections(checkout, updateSectionsDto);
  }


  @Patch('default/settings')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async updateDefaultCheckoutStyles(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<void> {
    await ValidationService.validateDto(updateSettingsDto);

    const checkout: CheckoutModel = await this.checkoutService.findDefaultForBusiness(business);
    if (!checkout) {
      throw new HttpException('Could not find default checkout', HttpStatus.BAD_REQUEST);
    }

    await this.checkoutService.updateSettings(checkout, updateSettingsDto.settings);
    if (updateSettingsDto.logo) {
      await this.checkoutService.updateLogo(checkout, updateSettingsDto.logo);
    }
  }

  @Patch(':checkoutId/default')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  public async setCheckoutDefault(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<void> {
    await this.checkoutService.setDefault(checkout, business);
    await this.rabbitEventsProducer.businessCheckoutUpdated(checkout);
  }

  @Delete(CHECKOUT_ID_PLACEHOLDER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'The record has been successfully deleted' })
  @Acl({ microservice: 'checkout', action: AclActionsEnum.delete })
  public async deleteCheckout(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: CHECKOUT_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      CheckoutSchemaName,
    ) checkout: CheckoutModel,
  ): Promise<void> {
    await this.checkoutService.remove(checkout, business);
    await this.rabbitEventsProducer.businessCheckoutRemoved(business, checkout);
  }
}
