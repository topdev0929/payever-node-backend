import { Controller, UseGuards, HttpStatus, Post, Body, Delete, Put, Get } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel, AclActionsEnum, Acl } from '@pe/nest-kit';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateShippingBoxDto, UpdateShippingBoxDto } from '../dto';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessModel } from '../../business/models';
import { ShippingBoxModel, ShippingSettingModel } from '../models';
import { ShippingBoxService, ShippingSettingService } from '../services';
import { ShippingBoxSchemaName } from '../schemas';
import { IntegrationSubscriptionModel } from '../../integration';
import { CarrierBoxesDto } from '../dto/carrier-boxes.dto';

export const SHIPPING_BOX_ID: string = ':shippingBoxId';
export const BUSINESS_ID: string = ':businessId';

@Controller('business/:businessId/shipping-box')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Boxes')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ShippingBoxController {
  constructor(
    private readonly shippingBoxService: ShippingBoxService,
    private readonly shippingSettingService: ShippingSettingService,
  ) {
  }

  @Get()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getBoxes(
    @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
  ): Promise<ShippingBoxModel[]> {
    return this.shippingBoxService.getBoxes(business.id);
  }

  @Get('default-boxes')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getDefaultBoxes(): Promise<ShippingBoxModel[]> {
    return this.shippingBoxService.getDefaultBoxes();
  }

  @Get('carrier-boxes')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getCarrierBoxes(
    @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
  ): Promise<CarrierBoxesDto[]> {
    await business.populate('integrationSubscriptions').execPopulate();
    const integrationSubs: IntegrationSubscriptionModel[]
      = business.integrationSubscriptions as IntegrationSubscriptionModel[];

    const boxes: CarrierBoxesDto[] = [];
    for (const integrationSub of integrationSubs) {
      await integrationSub.populate('integration').execPopulate();
      const carrierBoxes: CarrierBoxesDto = new CarrierBoxesDto();
      carrierBoxes.integration = integrationSub.integration;
      carrierBoxes.boxes = await this.shippingBoxService.findOneByIntegration(integrationSub.integration.id);
      boxes.push({ ...carrierBoxes, enabled: integrationSub.enabled });
    }

    return boxes;
  }

  @Post()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.create })
  public async create(
    @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
    @Body() dto: CreateShippingBoxDto,
  ): Promise<ShippingBoxModel> {
    dto.business = business.id;
    const shippingBoxModel: ShippingBoxModel = await this.shippingBoxService.create(dto);
    const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
    await this.shippingSettingService.addShippingBox(shippingBoxModel, shippingSettingModel);

    return shippingBoxModel;
  }

  @Post('multi')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.create })
  public async createMultiple(
    @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
    @Body() dtos: CreateShippingBoxDto[],
  ): Promise<ShippingBoxModel[]> {
    for (const dto of dtos) {
      dto.business = business.id;
      const shippingBoxModel: ShippingBoxModel = await this.shippingBoxService.create(dto);
      const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
      await this.shippingSettingService.addShippingBox(shippingBoxModel, shippingSettingModel);
    }

    return this.shippingBoxService.getBoxes(business.id);
  }

  @Get(SHIPPING_BOX_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async get(
    @ParamModel(SHIPPING_BOX_ID, ShippingBoxSchemaName) shippingBox: ShippingBoxModel,
  ): Promise<ShippingBoxModel> {

    return shippingBox;
  }

  @Put(SHIPPING_BOX_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async update(
    @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
    @ParamModel(SHIPPING_BOX_ID, ShippingBoxSchemaName) shippingBoxModel: ShippingBoxModel,
    @Body() dto: UpdateShippingBoxDto,
  ): Promise<ShippingBoxModel> {
    dto.business = business.id;

    return this.shippingBoxService.update(shippingBoxModel, dto);
  }

  @Delete(SHIPPING_BOX_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel(BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
    @ParamModel(SHIPPING_BOX_ID, ShippingBoxSchemaName) shippingBox: ShippingBoxModel,
  ): Promise<ShippingBoxModel> {
    const shippingSettingModel: ShippingSettingModel = await this.shippingSettingService.findOrCreate(business._id);
    await this.shippingSettingService.removeShippingBox(shippingBox, shippingSettingModel);
    await this.shippingBoxService.deleteOneById(shippingBox._id);

    return shippingBox;
  }
}
