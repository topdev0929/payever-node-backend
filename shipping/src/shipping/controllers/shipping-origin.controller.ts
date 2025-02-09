import { Controller, UseGuards, HttpStatus, Post, Body, Delete, Put, Get } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel, AclActionsEnum, Acl } from '@pe/nest-kit';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateShippingOriginDto, UpdateShippingOriginDto } from '../dto';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessModel } from '../../business/models';
import { ShippingOriginModel, ShippingSettingModel } from '../models';
import { ShippingOriginService, ShippingSettingService } from '../services';
import { ShippingOriginSchemaName } from '../schemas';

export const SHIPPING_ORIGIN_ID: string = ':shippingOriginId';

@Controller('business/:businessId/shipping-origin')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Origins')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ShippingOriginController {
  constructor(
    private readonly shippingOriginService: ShippingOriginService,
    private readonly shippingSettingService: ShippingSettingService,
  ) {
  }

  @Post()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.create })
  public async create(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: CreateShippingOriginDto,
  ): Promise<ShippingOriginModel> {
    const shippingOriginModel: ShippingOriginModel = await this.shippingOriginService.create(dto);
    const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
    await this.shippingSettingService.addShippingOrigin(shippingOriginModel, shippingSettingModel);

    return shippingOriginModel;
  }

  @Get(SHIPPING_ORIGIN_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async get(
    @ParamModel(SHIPPING_ORIGIN_ID, ShippingOriginSchemaName) shippingOrigin: ShippingOriginModel,
  ): Promise<ShippingOriginModel> {
    return shippingOrigin
      .populate('localDelivery')
      .populate('localPickUp')
      .execPopulate();
  }

  @Put(SHIPPING_ORIGIN_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async update(
    @ParamModel(SHIPPING_ORIGIN_ID, ShippingOriginSchemaName) shippingOrigin: ShippingOriginModel,
    @Body() dto: UpdateShippingOriginDto,
  ): Promise<ShippingOriginModel> {
    return this.shippingOriginService.update(shippingOrigin._id, dto);
  }

  @Delete(SHIPPING_ORIGIN_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(SHIPPING_ORIGIN_ID, ShippingOriginSchemaName) shippingOrigin: ShippingOriginModel,
  ): Promise<ShippingOriginModel> {
    const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
    await this.shippingSettingService.removeShippingOrigin(shippingOrigin, shippingSettingModel);
    await this.shippingOriginService.deleteOneById(shippingOrigin._id);

    return shippingOrigin;
  }
}
