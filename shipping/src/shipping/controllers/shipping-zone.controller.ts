import { Controller, UseGuards, HttpStatus, Post, Body, Delete, Put, Get } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel, AclActionsEnum, Acl } from '@pe/nest-kit';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateShippingZoneDto, UpdateShippingZoneDto } from '../dto';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessModel } from '../../business/models';
import { ShippingZoneModel, ShippingSettingModel } from '../models';
import { ShippingZoneService, ShippingSettingService } from '../services';
import { ShippingZoneSchemaName } from '../schemas';

export const SHIPPING_ZONE_ID: string = ':shippingZoneId';

@Controller('business/:businessId/shipping-zone')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Zones')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ShippingZoneController {
  constructor(
    private readonly shippingZoneService: ShippingZoneService,
    private readonly shippingSettingService: ShippingSettingService,
  ) {
  }

  @Post()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async create(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: CreateShippingZoneDto,
  ): Promise<ShippingZoneModel> {
    const shippingZoneModel: ShippingZoneModel = await this.shippingZoneService.create(dto, business._id);
    const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
    await this.shippingSettingService.addShippingZone(shippingZoneModel, shippingSettingModel);

    return shippingZoneModel;
  }

  @Get(SHIPPING_ZONE_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async get(
    @ParamModel(SHIPPING_ZONE_ID, ShippingZoneSchemaName) shippingZone: ShippingZoneModel,
  ): Promise<ShippingZoneModel> {
    return shippingZone;
  }

  @Put(SHIPPING_ZONE_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async update(
    @ParamModel(SHIPPING_ZONE_ID, ShippingZoneSchemaName) shippingZone: ShippingZoneModel,
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: UpdateShippingZoneDto,
  ): Promise<ShippingZoneModel> {
    return this.shippingZoneService.update(shippingZone._id, dto, business._id);
  }

  @Delete(SHIPPING_ZONE_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(SHIPPING_ZONE_ID, ShippingZoneSchemaName) shippingZone: ShippingZoneModel,
  ): Promise<ShippingZoneModel> {
    const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
    await this.shippingSettingService.removeShippingZone(shippingZone, shippingSettingModel);
    await this.shippingZoneService.deleteOneById(shippingZone._id, business._id);

    return shippingZone;
  }
}
