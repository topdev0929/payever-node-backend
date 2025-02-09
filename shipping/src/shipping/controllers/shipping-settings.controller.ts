import { Controller, UseGuards, HttpStatus, Body, Get, Delete, Put, Post, Param } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel, AclActionsEnum, Acl } from '@pe/nest-kit';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessModel } from '../../business/models';
import { ShippingSettingService } from '../services';
import { ShippingSettingModel, ShippingOriginModel } from '../models';
import { ShippingOriginSchemaName, ShippingSettingSchemaName } from '../schemas';
import { CreateShippingSettingDto } from '../dto/create-shipping-settings.dto';

const BUSINESS_ID: string = ':businessId';
const SHIPPING_SETTING_ID: string = ':shippingOriginId';

@Controller('business/:businessId/shipping-settings')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Settings')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.'})
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.'})
export class ShippingSettingsController {
    constructor(
        private readonly shippingSettingService: ShippingSettingService,
    ) { }

    @Get()
    @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
    public async get(
      @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
    ): Promise<ShippingSettingModel[]> {

      return this.shippingSettingService.findByBusinessId(business._id);
    }

    @Get(SHIPPING_SETTING_ID)
    @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
    public async getSettingById(
      @Param('shippingOriginId') id: string,
    ): Promise<ShippingSettingModel> {

      return this.shippingSettingService.findOneById(id);
    }

    @Post()
    @Acl({ microservice: 'shipping', action: AclActionsEnum.create })
    public async create(
      @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
      @Body() dto: CreateShippingSettingDto,
    ): Promise<ShippingSettingModel> {
      dto.business = business.id;

      return this.shippingSettingService.create(dto);
    }

    @Put(SHIPPING_SETTING_ID)
    @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
    public async update(
      @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
      @ParamModel(SHIPPING_SETTING_ID, ShippingSettingSchemaName) setting: ShippingSettingModel,
      @Body() dto: CreateShippingSettingDto,
    ): Promise<ShippingSettingModel> {
      dto.business = business.id;

      return this.shippingSettingService.update(setting.id, dto);
    }

    @Delete(SHIPPING_SETTING_ID)
    @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
    public async delete(
      @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
      @ParamModel(SHIPPING_SETTING_ID, ShippingSettingSchemaName) setting: ShippingSettingModel,
    ): Promise<void> {
      await this.shippingSettingService.deleteOneById(setting.id, business.id);
    }

    @Put('default-origin/:shippingOriginId')
    @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
    public async setDefaultOrigin(
      @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
      @ParamModel(SHIPPING_SETTING_ID, ShippingOriginSchemaName) shippingOrigin: ShippingOriginModel,
    ): Promise<ShippingSettingModel> {
      return this.shippingSettingService.setBusinessDefaultOrigin(business._id, shippingOrigin._id);
    }
}
